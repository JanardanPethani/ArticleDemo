const express = require('express')
const router = new express.Router()

const Comment = require('../models/comment')
const Article = require('../models/article')

router.post("/articles/:articleId/comment", async (req, res) => {
    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment(req.body);

    try {
        await comment.save()
        const article = await Article.findById(req.params.articleId)
        await article.comments.unshift(comment)
        await article.save()
        res.status(201).send({ article })
    } catch (e) {
        res.status(400).send(e.message)
    }
});

module.exports = router