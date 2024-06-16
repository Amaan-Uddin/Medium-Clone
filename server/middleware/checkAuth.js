module.exports = {
	userAuthenticated: (req, res, next) => {
		console.log(req.user, req.session, req.isAuthenticated())
		if (req.isAuthenticated()) next()
		else res.json({ error: 'unauthorized', loggedIn: false })
	},
}
