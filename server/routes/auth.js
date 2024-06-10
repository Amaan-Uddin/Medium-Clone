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
		failureRedirect: 'http://localhost:5173/',
		failureMessage: true,
	}),
	async (req, res) => {
		await Bookmark.findOrCreate({ userId: req.user._id })
		await Like.findOrCreate({ userId: req.user._id })
		await Profile.findOrCreate({ userId: req.user._id })
		res.redirect(`http://localhost:5173/home`)
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

router.get('/user', userAuthenticated, (req, res) => {
	const user = {
		...req.user,
		loggedIn: true,
	}
	res.json(user)
})

module.exports = router
