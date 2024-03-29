var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
    name: {
        type: 'string',
        minLength: 2,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: { createdAt: 'created_at' } })


// UserSchema.methods.toJSON = function () {
//     const topic = this
//     const topicObj = topic.toObject()

//     delete topicObj.password
//     delete topicObj.tokens
//     delete topicObj.followers
//     delete topicObj.following

//     return topicObj
// }

Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic