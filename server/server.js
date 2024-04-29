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
const { Bookmark, Like } = require('./models/BlogStats')
require('./config/googleStrategy')

const authRouter = require('./routes/auth')
const { userAuthenticated } = require('./middleware/checkAuth')
const { uploadMiddleware } = require('./middleware/uploadMiddleware')

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
			type: 'upload',
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
				originalname: req.file.originalname,
			},
		})

		const unlink_res = await fsPromises.unlink(req.file.path)
		res.status(200).json(newBlog)
	} catch (error) {
		console.error(error)
		res.sendStatus(500).json({ message: error })
	}
})

app.post('/myblogs', userAuthenticated, async (req, res) => {
	try {
		const { userId } = req.body
		if (!userId) res.status(403).json({ message: 'valid userId required' })

		const myPost = await Blog.find({ userId: userId }).populate('userId').sort({ createdAt: -1 }) // populate the userId to get the author of Blog

		if (myPost?.length) {
			return res.status(200).json(myPost)
		}
		res.sendStatus(404)
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch post' })
	}
})

app.get('/all', userAuthenticated, async (req, res) => {
	try {
		const allPost = await Blog.find().populate('userId').sort({ createdAt: -1 })
		if (!allPost?.length) return res.sendStatus(404)
		res.status(200).json(allPost)
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch post' })
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
		console.error(error)
		res.status(500).json({ message: 'server failed to fetch post' })
	}
})

app.delete('/delete', userAuthenticated, async (req, res) => {
	try {
		const { userId, id } = req.body

		if (!id || !userId) return res.sendStatus(400)

		const blogPost = await Blog.findOne({ _id: id }).populate('userId')
		if (!blogPost) return res.sendStatus(404)

		if (userId !== blogPost.userId.id) return res.sendStatus(401)

		await cloudinary.uploader.destroy(blogPost.image.public_id, { resource_type: 'image', type: 'upload' })
		await Blog.deleteOne({ _id: blogPost.id })

		res.status(200).json({ message: 'Blog successfully deleted' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server failed to delete post' })
	}
})

app.post('/check-bookmark', userAuthenticated, async (req, res) => {
	try {
		const { id } = req.query
		const { userId } = req.body
		if (!id || !userId) {
			return res.sendStatus(400)
		}
		const bookmark = await Bookmark.findOne({ userId: userId })
		if (!bookmark) throw new Error('Error: server issue')
		if (bookmark?.bookmark.length) {
			const result = bookmark.bookmark.includes(id)
			return res.status(200).json(result)
		}
		res.status(200).json(false)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server failed to check bookmark' })
	}
})

app.post('/check-like', userAuthenticated, async (req, res) => {
	try {
		const { id } = req.query
		const { userId } = req.body
		if (!id || !userId) {
			return res.sendStatus(400)
		}
		const like = await Like.findOne({ userId: userId })
		if (!like) throw new Error('Error: server issue')
		if (like?.like.length) {
			const result = like.like.includes(id)
			return res.status(200).json(result)
		}
		res.status(200).json(false)
	} catch (error) {
		res.status(500).json({ message: 'server failed to check likes' })
	}
})

app.post('/bookmark', userAuthenticated, async (req, res) => {
	try {
		const { userId, id, isBookmarked } = req.body

		if (!userId || !id) return res.sendStatus(400)

		if (isBookmarked) {
			const bookmark = await Bookmark.findOneAndUpdate(
				{ userId: userId },
				{ $pull: { bookmark: id } },
				{ new: true }
			)
			console.log(bookmark)
			return res.status(200).json({ message: 'successfully removed bookmark' })
		} else {
			const bookmark = await Bookmark.findOneAndUpdate(
				{ userId: userId },
				{ $addToSet: { bookmark: id } },
				{ new: true }
			)
			console.log(bookmark)
			return res.status(200).json({ message: 'successfully added to bookmark' })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server failed to bookmark post' })
	}
})
app.post('/like', userAuthenticated, async (req, res) => {
	try {
		const { userId, id, isLiked } = req.body

		if (!userId || !id) return res.sendStatus(400)

		if (isLiked) {
			const like = await Like.findOneAndUpdate({ userId: userId }, { $pull: { like: id } }, { new: true })
			console.log(like)
			const blog = await Blog.findOneAndUpdate({ _id: id }, { $inc: { like: -1 } }, { new: true })
			console.log(blog)
			return res.status(200).json(blog.like)
		} else {
			const like = await Like.findOneAndUpdate({ userId: userId }, { $addToSet: { like: id } }, { new: true })
			console.log(like)
			const blog = await Blog.findOneAndUpdate({ _id: id }, { $inc: { like: 1 } }, { new: true })
			console.log(blog)
			return res.status(200).json(blog.like)
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server failed to bookmark post' })
	}
})

app.post('/mybookmarks', userAuthenticated, async (req, res) => {
	try {
		const { userId } = req.body
		if (!userId) return res.sendStatus(400)

		const bookmark = await Bookmark.findOne({ userId: userId }).populate('bookmark')
		if (!bookmark) throw new Error('Error: server issue')
		if (bookmark?.bookmark.length) {
			const populatePromises = bookmark.bookmark.map((post) => post.populate('userId'))
			await Promise.all(populatePromises)
			return res.status(200).json(bookmark.bookmark)
		}
		res.status(200).json([])
	} catch (error) {
		res.status(500).json({ message: 'server failed to send bookmark' })
	}
})

app.put('/edit', async (req, res) => {
	try {
		const { title, description, content, userId } = req.body
		const { id, post } = req.query
		console.log(title, description, content, userId)
		if (!userId || !title || !content) return res.sendStatus(403)
		if (!id || !post) return res.sendStatus(400)
		const updatedBlog = await Blog.updateOne(
			{ _id: id, slug: post },
			{ title: title, description: description, content: content, userId: userId }
		)
		if (!updatedBlog.modifiedCount) throw new Error('no update/modification')
		res.status(200).json({ message: 'successfully updated blog' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server failed to update post' })
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
