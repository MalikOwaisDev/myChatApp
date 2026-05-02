const mongoose = require('mongoose');

const chatRequestSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// One request per conversation (not per user pair — conversation is unique)
chatRequestSchema.index({ conversationId: 1 }, { unique: true });
chatRequestSchema.index({ to: 1, status: 1 });

module.exports = mongoose.model('ChatRequest', chatRequestSchema);
