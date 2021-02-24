var mongoose = require('mongoose')

var articleSchema = new mongoose.Schema({
    title: {
        type: 'string',
        minLength: 3,
        required: true
    },
    topic: {
        type: 'string',
        ref: 'Topic'
    },
    content: {
        type: 'string',
        minLength: 5,
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model("Article", articleSchema);