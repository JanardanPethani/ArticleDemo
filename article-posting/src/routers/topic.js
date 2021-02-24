const express = require('express')
const Topic = require('../models/topic')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post("/topics/new", auth, async (req, res) => {
    const topic = new Topic(req.body)

    try {
        await topic.save()
        res.status(201).send({ topic })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get("/topics/all", async (req, res) => {
    Topic.find({}, (err, result) => {
        res.send(result)
    })
})

module.exports = router