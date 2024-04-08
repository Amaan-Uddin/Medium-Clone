const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/',
		failureMessage: true,
	}),
	(req, res) => {
		console.log(req.user)
		// res.redirect('/')
		res.redirect(`http://localhost:5173/`)
	}
)

module.exports = router
