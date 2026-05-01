const mongoose = require('mongoose');
const Conversation = require('../../models/conversation.model');
const User = require('../../models/user.model');
const { createMediaMessage } = require('../../services/mediaMessage.service');
const { emitToUser } = require('../../utils/socketEmitter');
const { validateBase64Image } = require('../../utils/image.util');

const mediaHandler = (io, socket) => {
  socket.on('send_media', async ({ conversationId, media }) => {
    try {
      if (!conversationId || !media) {
        socket.emit('message_error', { error: 'Invalid media data' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.emit('message_error', { error: 'Invalid conversation ID' });
        return;
      }

      const validation = validateBase64Image(media);
      if (!validation.valid) {
        socket.emit('message_error', { error: validation.error });
        return;
      }

      const mediaType = media.match(/^data:(image\/[a-z]+);base64,/)?.[1];
      if (!mediaType) {
        socket.emit('message_error', { error: 'Could not determine media type' });
        return;
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        socket.emit('message_error', { error: 'Conversation not found' });
        return;
      }

      const isMember = conversation.participants.some((p) => String(p) === socket.userId);
      if (!isMember) {
        socket.emit('message_error', { error: 'Access denied' });
        return;
      }

      const otherId = String(conversation.participants.find((p) => String(p) !== socket.userId));
      const [senderData, otherData] = await Promise.all([
        User.findById(socket.userId, 'name blockedUsers').lean(),
        User.findById(otherId, 'blockedUsers').lean(),
      ]);

      const isBlocked =
        senderData?.blockedUsers?.some((id) => String(id) === otherId) ||
        otherData?.blockedUsers?.some((id) => String(id) === socket.userId);

      if (isBlocked) {
        socket.emit('message_error', { error: 'Cannot message this user' });
        return;
      }

      const [message] = await Promise.all([
        createMediaMessage(conversationId, socket.userId, media, mediaType),
      ]);

      const payload = {
        _id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: senderData?.name || 'Someone',
        media: message.media,
        mediaType: message.mediaType,
        messageType: message.messageType,
        status: message.status,
        createdAt: message.createdAt,
      };

      for (const participantId of conversation.participants) {
        emitToUser(String(participantId), 'receive_message', payload);
      }
    } catch {
      socket.emit('message_error', { error: 'Failed to send media' });
    }
  });
};

module.exports = mediaHandler;
