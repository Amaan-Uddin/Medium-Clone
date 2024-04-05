require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
require('./config/googleStrategy')

const app = express()
connectDB()

if (process.env.NODE_ENV == 'Development') app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
	session({
		secret: '',
		resave: false,
		saveUninitialized: false,
		cookie: { httpOnly: true },
		store: MongoStore({ mongUrl: process.env.MONGO_URI, collectionName: 'sessions' }),
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/this', (req, res) => {
	res.json({ key: 'value' })
})

const PORT = process.env.PORT || 3000
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
})
