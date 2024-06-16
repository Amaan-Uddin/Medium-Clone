module.exports = {
	userAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			console.log('req.isAuth checks out')
			next()
		} else {
			console.log('req.isAuth does not check out')
			res.json({ error: 'unauthorized', loggedIn: false })
		}
	},
}
