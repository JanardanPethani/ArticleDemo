const express = require('express')
const router = new express.Router()

const Comment = require('../models/comment')
const Article = require('../models/article')
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post("/articles/:articleId/comment", auth, async (req, res) => {
    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment({
        ...req.body,
        by: req.user._id,
        for: req.params.articleId
    });

    try {
        await comment.save()
        const article = await Article.findById(req.params.articleId)
        await article.comments.unshift(comment)
        await article.save()
        res.status(201).send({ article, comment })
    } catch (e) {
        res.status(400).send(e.message)
    }
});

module.exports = router