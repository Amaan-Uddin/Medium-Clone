const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: 'http://localhost:5000/auth/google/callback',
			passReqToCallback: true,
		},
		async function (request, accessToken, refreshToken, profile, done) {
			try {
				// get the returned data from profile
				let data = profile?._json
				let user = await User.findOne({ email: data.email })

				if (!user) {
					// create user, if user does not exist
					const newUser = await User.create({
						firstname: data.given_name,
						lastname: data.family_name,
						user_image: data.picture,
						email: data.email,
					})
					return await done(null, newUser)
				}
				return await done(null, user)
			} catch (error) {
				return done(error, false)
			}
		}
	)
)

// check chatgpt if not working https://chat.openai.com/share/57c4b8c2-e1f0-4087-b2a7-1a46d69b3a99
passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})
