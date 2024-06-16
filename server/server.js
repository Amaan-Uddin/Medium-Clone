require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')
const path = require('path')
require('./config/googleStrategy')
const authRouter = require('./routes/auth')
const apiRouter = require('./routes/api')

const app = express()
connectDB()

app.use(cookieParser())
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: false }))
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: process.env.COOKIE_SECURE,
			maxAge: 24 * 60 * 60 * 1000,
			sameSite: process.env.COOKIE_SAMESITE,
			domain: process.env.COOKIE_DOMAIN_NAME,
		},
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: 'sessions' }),
	})
)
app.use(passport.authenticate('session'))
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)
app.use('/api', apiRouter)

const PORT = process.env.PORT || 3000
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
})
