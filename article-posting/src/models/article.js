var mongoose = require('mongoose')
var Topic = require('./topic')

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
            ref: 'Comment',
            required: true
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: { createdAt: 'created_at' } });

articleSchema.pre('save', async function (next) {
    const article = this
    // console.log(typeof article.topic);
    const topicName = await Topic.findOne({ name: article.topic })
    if (topicName) {
        next()
    } else {
        const newTopic = new Topic({
            name: article.topic,
            createdBy: article.author
        })
        await newTopic.save()
        next()
    }
})

module.exports = mongoose.model("Article", articleSchema);