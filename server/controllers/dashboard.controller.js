const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

const getDashboardData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Run all queries in parallel
  const [messageCount, myConversations] = await Promise.all([
    Message.countDocuments({ senderId: req.user.id }),
    Conversation.find({ participants: req.user.id }, 'participants').lean(),
  ]);

  const stats = {
    memberSince: user.createdAt,
    profileComplete: !!(user.name && user.username && user.profileImage),
    messages: messageCount,
    conversations: myConversations.length,
  };
  const chattedIds = new Set(
    myConversations.flatMap((c) =>
      c.participants.map(String).filter((id) => id !== String(req.user.id))
    )
  );
  chattedIds.add(String(req.user.id));

  const suggestions = await User.find(
    {
      _id: { $nin: [...chattedIds] },
      isPublic: true,
      blockedUsers: { $nin: [req.user.id] },
    },
    'name username profileImage'
  )
    .limit(6)
    .lean();

  res.json({ user, stats, suggestions });
});

module.exports = { getDashboardData };
