module.exports = {
	userAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) next()
		else res.json({ error: 'unauthorized', loggedIn: false })
	},
}
