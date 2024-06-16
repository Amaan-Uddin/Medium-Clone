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
		console.log('User authenticated:', req.user, 'Session:', req.session, 'isAuthenticated:', req.isAuthenticated())
		await Bookmark.findOrCreate({ userId: req.user._id })
		await Like.findOrCreate({ userId: req.user._id })
		await Profile.findOrCreate({ userId: req.user._id })
		res.redirect(`${process.env.CLIENT_URL}/home`)
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

router.get(
	'/user',
	(req, res, next) => {
		console.log(req.user, req.session, req.isAuthenticated())
		if (req.isAuthenticated()) next()
		else res.json({ error: 'unauthorized', loggedIn: false })
	},
	(req, res) => {
		const user = {
			...req.user,
			loggedIn: true,
		}
		res.status(200).json(user)
	}
)

module.exports = router
