const express = require('express')
var jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

// done
router.post("/users/sign-up", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    } catch (e) {
        console.log(e);
        res.status(400).send(e.message)
    }

})

// done
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


// done
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

// done
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send({ message: 'Successfuly log out from all sessions ' + req.user.username })

    } catch (e) {
        res.status(500).send({ error: "Error" + e })
    }
})

// done
router.post('/users/:userId/follow', auth, async (req, res) => {
    try {
        if (req.params.userId == req.user._id) {
            throw new Error('Can not follow your self')
        }
        const user = await User.findById(req.params.userId)
        if (!user) {
            throw new Error('Not found')
        }

        const userFound = await User.findOne({ _id: req.user._id, 'following.user': user._id })
        if (userFound) {
            throw new Error('Already Subscribed')
        }

        await req.user.following.push({ user: user._id })
        await user.followers.push({ user: req.user._id })
        await req.user.save()
        await user.save()
        // console.log(user, req.user);
        res.status(200).send(`Followed ${user.name}`)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

//done
router.post('/users/:userId/unfollow', auth, async (req, res) => {
    try {
        if (req.params.userId == req.user._id) {
            throw new Error('Can not unfollow your self')
        }
        const user = await User.findById(req.params.userId)
        if (!user) {
            throw new Error('Not found')
        }

        const userFound = await User.updateOne({ _id: req.user._id }, { $pull: { following: { user: user._id } } })
        if (!userFound) {
            throw new Error("Can't find in following")
        }

        await User.updateOne({ _id: user._id }, { $pull: { followers: { user: req.user._id } } })
        await req.user.save()
        await user.save()
        // console.log(user, req.user);
        res.status(200).send(`unFollowed ${user.name}`)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

// done
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})

// done
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router