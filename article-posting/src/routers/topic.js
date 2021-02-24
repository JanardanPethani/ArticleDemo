const express = require('express')
const Topic = require('../models/topic')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post("/topics/new", auth, async (req, res) => {
    try {
        const newTopic = new Topic({
            ...req.body,
            createdBy: req.user._id
        })
        const isAvail = await Topic.isAvailable(req.body.name)

        await newTopic.save()
        res.status(201).send(newTopic)
    } catch (err) {
        // console.log(err.message);
        res.status(400).send(err.message)
    }
})

router.get("/topics/all", auth, async (req, res) => {
    Topic.find({}).populate('createdBy').exec((err, result) => {
        res.send(result)
    })
})

module.exports = router