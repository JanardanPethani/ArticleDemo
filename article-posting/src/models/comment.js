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

CommentSchema.methods.toJSON = function () {
    const comment = this
    const commObj = comment.toObject()

    delete commObj._id
    delete commObj.created_at
    delete commObj.updatedAt
    delete commObj.__v
    delete commObj.updatedAt
    delete commObj.for
    // delete userObj.followers
    // delete userObj.following

    return commObj
}


module.exports = mongoose.model("Comment", CommentSchema);