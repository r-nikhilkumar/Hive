const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the post model (if exists)
        required: true,
    },
    comments: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: mongoose.Types.ObjectId,
                auto: true,
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                index: true, // Add index to userId
            },
            comment: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = mongoose.model("Comment", CommentSchema);
