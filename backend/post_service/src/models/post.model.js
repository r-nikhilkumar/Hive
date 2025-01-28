const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    content_type: {
        type: String,
        enum: ["image", "video", null],
        default: null,
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        validate: {
            validator: function (value) {
                if (this.content_type === "image") {
                    return Array.isArray(value) && value.every((item) => typeof item === "string");
                } else if (this.content_type === "video") {
                    return typeof value === "string";
                } else if (this.content_type === null) {
                    return value === null;
                }
                return false;
            },
            message: "Invalid content type: content must match content_type requirements.",
        },
        default: null,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
        default: null,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("Post", PostSchema);
