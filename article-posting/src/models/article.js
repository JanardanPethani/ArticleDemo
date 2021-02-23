
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: {
        type: 'string',
        minLength: 3,
        required: true
    },
    topic: {
        type: 'string',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});

module.exports = mongoose.model("Article", articleSchema);