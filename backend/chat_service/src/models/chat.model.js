const mongoose = require("mongoose");

const AttachmentSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
});

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
    attachments: {
      type: [AttachmentSchema],
      default: [],
      validate: {
        validator: function (v) {
          return this.message || (v && v.length > 0);
        },
        message: "Either message or attachments must be provided.",
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
