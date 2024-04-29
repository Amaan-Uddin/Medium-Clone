const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Bookmark, Like } = require('../models/BlogStats')

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/',
		failureMessage: true,
	}),
	async (req, res) => {
		console.log(req.user)
		await Bookmark.findOrCreate({ userId: req.user._id })
		await Like.findOrCreate({ userId: req.user._id })
		res.redirect(`http://localhost:5173/`)
	}
)

module.exports = router
