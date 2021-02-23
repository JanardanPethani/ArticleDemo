const express = require('express')
const Article = require('../models/article')

const router = new express.Router()

router.post("/articles/new", async (req, res) => {
    const article = new Article(req.body)

    try {
        await article.save()
        res.status(201).send({ article })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get("/articles/all", async (req, res) => {
    Article.find({}, (err, result) => {
        res.send(result)
    })
})

module.exports = router