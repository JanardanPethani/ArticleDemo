const mongoose = require('mongoose')

try {
    mongoose.connect('mongodb://127.0.0.1:27017/article-demo', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }, () => {
        console.log('Conncted to db ');
    })
} catch (e) {
    console.log(e);
};

