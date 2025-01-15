const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true, // Index for better performance
    },
    message: {
      type: String,
      required: false, // Make message optional
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true, // Index for better performance
    },
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ChatRoom", // Reference to the ChatRoom document
      index: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    attachments: [
      {
        name: String,
        type: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Custom validation to ensure at least one of message or attachments is provided
ChatSchema.pre('save', function(next) {
  if (!this.message && this.attachments.length === 0) {
    return next(new Error('Either message or attachments must be provided.'));
  }
  next();
});

module.exports = mongoose.model("Chat", ChatSchema);
