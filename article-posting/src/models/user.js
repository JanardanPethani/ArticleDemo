const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')


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
UserSchema.pre("save", function (next) {
    // ENCRYPT PASSWORD
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

// Need to use function to enable this.password to work.
UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SIGN)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

module.exports = mongoose.model('User', UserSchema)
