const mongoose = require('mongoose');
const Conversation = require('../../models/conversation.model');
const { emitToUser } = require('../../utils/socketEmitter');

const typingHandler = (io, socket) => {
  const handleTyping = (event, data) => {
    const { conversationId } = data || {};
    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) return;

    Conversation.findById(conversationId, 'participants')
      .lean()
      .then((conversation) => {
        if (!conversation) return;
        const isMember = conversation.participants.some(
          (p) => String(p) === socket.userId
        );
        if (!isMember) return;

        const payload = { conversationId: String(conversationId), userId: socket.userId };
        for (const participantId of conversation.participants) {
          if (String(participantId) !== socket.userId) {
            emitToUser(String(participantId), event, payload);
          }
        }
      })
      .catch(() => {});
  };

  socket.on('typing_start', (data) => handleTyping('typing_start', data));
  socket.on('typing_stop', (data) => handleTyping('typing_stop', data));
};

module.exports = typingHandler;
