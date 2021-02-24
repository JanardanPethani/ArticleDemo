const express = require('express')
var jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post("/users/sign-up", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    } catch (e) {
        res.status(400).send(e.message)
    }

})

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ token, message: 'Log In Successful of ' + user.username })
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
});


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send({ message: 'Logout Successful of ' + req.user.username })

    } catch (e) {
        res.status(500).send("Error :" + e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send({ message: 'Successfuly log out from all sessions ' + req.user.username })

    } catch (e) {
        res.status(500).send({ error: "Error" + e })
    }
})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})
module.exports = router