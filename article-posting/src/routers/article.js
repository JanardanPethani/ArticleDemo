const express = require('express')
const Article = require('../models/article')
const User = require('../models/user')
const auth = require('../middleware/auth')
var Comment = require('../models/comment')

const router = new express.Router()

router.post("/articles/new", auth, async (req, res) => {
    const article = new Article(
        {
            ...req.body,
            author: req.user._id
        }
    )

    try {
        await article.save()
        await req.user.articles.unshift(article)
        await req.user.save()
        res.status(201).send({ article })
    } catch (e) {
        res.status(400).send({ error: 'From Router : ' + e.message })
    }
})

router.get("/articles/:id", async (req, res) => {
    Article.find({ author: req.params.id }).populate('comments').exec((err, result) => {
        if (err) {
            res.send(err)
        }

        res.send(result)
    })
})



//* Filter options
// 1. Latest
// 2. All
// 3. Topic

router.get("/articles", async (req, res) => {
    const topic = req.query.topic ? req.query.topic : false
    const all = req.query.All ? req.query.All : false
    const latest = req.query.Latest ? req.query.Latest : false

    var query = Article.find({});
    if (latest) {
        query.sort({ created_at: -1 }).limit(+latest)
    }
    if (!all) {
        if (topic) {
            query.where('topic', topic)
        }
    }

    query.populate('author').populate('comments').exec(function (err, docs) {
        if (err) {
            res.status(500).send(err)
        }
        res.send(docs)
    });

})

router.patch('/articles/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["title", "topic", "content"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const result = await Article.findOne({ _id: req.params.id, author: req.user._id })

        updates.forEach((update) => result[update] = req.body[update])

        //by this middleware will be executed
        await result.save()

        if (!result) {
            return res.status(404).send()
        }

        res.send(result)

    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
})

router.delete('/articles/:id', auth, async (req, res) => {
    try {
        const article = await Article.findOneAndRemove({ _id: req.params.id, author: req.user._id })
        await User.updateOne({ _id: req.user._id }, { $pull: { "articles": req.params.id } })
        await Comment.deleteMany({ for: article._id })
        console.log(article._id);
        if (!article) {
            return res.status(404).send()
        }

        res.send(article)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router