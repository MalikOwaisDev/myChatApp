const { getConversationPartners, isOnline } = require('../../services/presence.service');
const { emitToUser } = require('../../utils/socketEmitter');

const presenceHandler = (io, socket) => {
  // Register disconnect before async work so it's never missed
  socket.on('disconnect', async () => {
    try {
      // notificationHandler's disconnect already ran (registered first), so isOnline is accurate
      if (isOnline(socket.userId)) return;
      const partnerIds = await getConversationPartners(socket.userId);
      for (const partnerId of partnerIds) {
        emitToUser(partnerId, 'user_offline', { userId: socket.userId });
      }
    } catch {}
  });

  // Notify partners and send initial presence snapshot (fire-and-forget)
  (async () => {
    try {
      const partnerIds = await getConversationPartners(socket.userId);
      for (const partnerId of partnerIds) {
        emitToUser(partnerId, 'user_online', { userId: socket.userId });
      }
      const onlinePartnerIds = partnerIds.filter((id) => isOnline(id));
      socket.emit('presence_init', { onlineUserIds: onlinePartnerIds });
    } catch {}
  })();
};

module.exports = presenceHandler;
