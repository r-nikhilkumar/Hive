const mongoose = require("mongoose");

const ChatRoomSchema = mongoose.Schema(
  {
    roomName: {
      type: String,
      required: function() { return this.type === "group"; }, // Only required for group chats
      index: true, // Index for better performance
    },
    roomAvatar: {
      type: String,
      required: false, // Only required for group chats
    },
    roomDescription: {
      type: String,
      required: false, // Only required for group chats
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        index: true, // Index for better performance
      },
    ],
    type: {
      type: String,
      enum: ["personal", "group"],
      default: "personal",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
