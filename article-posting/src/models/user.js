const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const Article = require('./article')
var Comment = require('./comment')


// Schema object
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password must not contain "password" word')
            }
        }
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: { createdAt: 'created_at' }
})


//ES6 => functions do not bind this!
UserSchema.pre("save", async function (next) {
    // ENCRYPT PASSWORD
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});

UserSchema.pre('remove', async function (next) {
    const user = this
    await Article.deleteMany(
        {
            author: user._id
        })
    await Comment.deleteMany(
        {
            by: user._id
        })
    next()
})

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SIGN)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    // console.log('error');
    return token
}

UserSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })

    if (!user) {
        console.log('user not found');
        throw new Error("Wrong Username or Password")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        console.log('not match');
        throw new Error('Wrong Username or Password')
    }

    return user
}

UserSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.followers
    delete userObj.following

    return userObj
}

const User = mongoose.model('User', UserSchema)
module.exports = User
