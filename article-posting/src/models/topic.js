var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
    name: {
        type: 'string',
        minLength: 2,
        required: true
    }
})

module.exports = monoose.model('Topic', topicSchema)