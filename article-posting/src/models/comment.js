const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
},
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model("Comment", CommentSchema);