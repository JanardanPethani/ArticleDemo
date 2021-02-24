const express = require('express')
const Article = require('../models/article')
const User = require('../models/user')
const auth = require('../middleware/auth')

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

router.get("/articles/all", async (req, res) => {
    Article.find({}).populate('comments').populate('author').exec((err, result) => {
        res.send(result)
    })
})

router.get("/articles/:id", async (req, res) => {
    Article.find({ author: req.params.id }).populate('comments').exec((err, result) => {
        if (err) {
            res.send(err)
        }

        res.send(result)
    })
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
        const article = await Article.findOneAndDelete({ _id: req.params.id, author: req.user._id })

        if (!article) {
            return res.status(404).send()
        }

        res.send(article)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router