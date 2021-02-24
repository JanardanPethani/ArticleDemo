const mongoose = require('mongoose')
var assert = require('assert');
mongoose.Promise = global.Promise;
mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
    },
    function (err, db) {
        assert.equal(null, err);
        console.log("-- Connected successfully to database");
    })
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));
// mongoose.set('debug', true);