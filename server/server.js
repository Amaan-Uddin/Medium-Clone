require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const cors = require('cors')
const path = require('path')
const fsPromises = require('fs').promises
const cloudinary = require('./config/cloudinaryConfig')
const Blog = require('./models/Blog')
require('./config/googleStrategy')

const authRouter = require('./routes/auth')
const { userAuthenticated } = require('./middleware/checkAuth')
const { uploadMiddleware } = require('./middleware/uploadMiddleware')
const { nextTick } = require('process')

const app = express()
connectDB()

if (process.env.NODE_ENV == 'Development') app.use(morgan('dev'))

app.use(
	cors({
		origin: 'http://localhost:5173', // Update this with your React app's URL
		credentials: true,
	})
)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
	session({
		secret: 'hello',
		resave: false,
		saveUninitialized: false,
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: 'sessions' }),
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/user', userAuthenticated, (req, res) => {
	const user = {
		...req.user,
		loggedIn: true,
	}
	res.json(user)
})

app.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) res.sendStatus(500)
		else {
			res.clearCookie('connect.sid', { path: '/' })
			res.json({ logout: 'successful' })
		}
	})
})

app.post('/new', uploadMiddleware, async (req, res) => {
	try {
		const { title, content, description, userId } = req.body

		if (!req.file || !userId || !title || !content) {
			return res.status(400).json({ message: 'Incomplete request.' })
		}

		const result = await cloudinary.uploader.upload(req.file.path, {
			folder: 'mern-blog',
			resource_type: 'image',
		})

		const newBlog = await Blog.create({
			title,
			content,
			description,
			userId,
			image: {
				public_id: result.public_id,
				format: result.format,
				url: result.url,
				secure_url: result.secure_url,
			},
			userId,
		})

		const unlink_res = await fsPromises.unlink(req.file.path)
		console.log(unlink_res)
		res.status(200).json(newBlog)
	} catch (error) {
		console.error(error)
		res.sendStatus(500).json({ message: error })
	}
})

app.post('/my-post', userAuthenticated, async (req, res) => {
	try {
		const { userId } = req.body
		if (!userId) res.status(403).json({ message: 'valid userId required' })

		const myPost = await Blog.find({ userId: userId }).populate('userId') // populate the userId to get the author of Blog

		if (myPost?.length) {
			return res.status(200).json(myPost)
		}
		res.sendStatus(404)
	} catch (error) {
		res.status(500).json({ message: 'failed to fetch post' })
	}
})

app.get('/all', userAuthenticated, async (req, res) => {
	try {
		const allPost = await Blog.find().populate('userId')
		if (!allPost?.length) return res.sendStatus(404)
		res.status(200).json(allPost)
	} catch (error) {
		res.status(500).json({ message: 'failed to fetch post' })
	}
})

app.get('/read-blog', userAuthenticated, async (req, res) => {
	try {
		const { id, post } = req.query
		if (!id || !post) {
			return res.sendStatus(400)
		}
		const blogPost = await Blog.findOne({ _id: id, slug: post }).populate('userId')
		if (!blogPost) return res.sendStatus(404)
		res.status(200).json(blogPost)
	} catch (error) {
		res.status(500).json({ message: 'failed to fetch post' })
	}
})

app.use('/auth', authRouter)

const PORT = process.env.PORT || 3000
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
})
