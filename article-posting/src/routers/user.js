const express = require('express')
var jwt = require('jsonwebtoken')
const User = require('../models/user')
const router = new express.Router()

router.post("/users/sign-up", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.status(201).send({ user })

    } catch (e) {
        res.status(400).send(e.message)
    }

})

router.get('/logout', (req, res) => {
    res.clearCookie('nToken');
});



module.exports = router