const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Bookmark, Like } = require('../models/BlogStats')
const Profile = require('../models/Profile')
const { userAuthenticated } = require('../middleware/checkAuth')

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: process.env.CLIENT_URL,
		failureMessage: true,
	}),
	async (req, res) => {
		try {
			await Bookmark.findOrCreate({ userId: req.user._id })
			await Like.findOrCreate({ userId: req.user._id })
			await Profile.findOrCreate({ userId: req.user._id })
			res.redirect(`${process.env.CLIENT_URL}/home`)
		} catch (err) {
			console.log(err)
			res.status(500).json({ message: 'Internal server error' })
		}
	}
)

router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) res.sendStatus(500)
		else {
			res.clearCookie('connect.sid', { path: '/' })
			res.json({ logout: 'successful' })
		}
	})
})

router.get('/user', passport.authenticate('session'), userAuthenticated, (req, res) => {
	const user = {
		...req.user._doc,
		loggedIn: true,
	}
	res.status(200).json(user)
})

module.exports = router
