const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the post model
        required: true,
        index: true
    },
    likes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                index: true, // Add index to userId
            },
            date: {
                type: Date,
                default: Date.now, // When the like was added
            },
        },
    ],
});

module.exports = mongoose.model("Like", LikeSchema);
