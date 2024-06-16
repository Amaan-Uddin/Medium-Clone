const User = require('../models/User')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL,
			passReqToCallback: true,
		},
		async function (request, accessToken, refreshToken, profile, done) {
			try {
				// get the returned data from profile
				let data = profile?._json
				console.log(data)
				let user = await User.findOne({ email: data.email })
				if (!user) {
					// create user, if user does not exist
					const newUser = await User.create({
						email: data.email,
						googleId: data.id,
						firstName: data.given_name,
						lastName: data.family_name,
						displayName: `${data.given_name} ${data.family_name}`,
						photos: profile.photos.map((photo) => photo.value),
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

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id)
		done(null, user) // Deserialize user from the id
	} catch (error) {
		done(error, null)
	}
})
