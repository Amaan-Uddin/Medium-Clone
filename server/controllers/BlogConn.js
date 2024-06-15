const Blog = require('../models/Blog')
const fsPromises = require('fs').promises
const cloudinary = require('../config/cloudinaryConfig')
const { Bookmark, Like, Tags } = require('../models/BlogStats')
const Profile = require('../models/Profile')
const Comments = require('../models/Comments')
const User = require('../models/User')
const findOrCreate = require('../function/findOrCreate')

const newPost = async (req, res) => {
	try {
		const { title, content, description, tags, userId } = req.body

		if (!req.file || !userId || !title || !description || !content) {
			return res.status(400).json({ message: 'Incomplete request.' })
		}

		const profile = await findOrCreate({ userId: userId }, Profile)
		const result = await cloudinary.uploader.upload(req.file.path, {
			folder: process.env.CLOUDINARY_PROD_DIRECTORY,
			resource_type: 'image',
			type: 'upload',
		})

		const newBlog = await Blog.create({
			title,
			content,
			description,
			userId,
			tags: JSON.parse(tags),
			image: {
				public_id: result.public_id,
				format: result.format,
				url: result.url,
				secure_url: result.secure_url,
				originalname: req.file.originalname,
			},
			profile: profile,
		})
		// await updateTags(JSON.parse(tags))
		JSON.parse(tags).forEach(async (tag) => {
			const result = await findOrCreate({ tag: tag }, Tags)
			if (!result.posts.includes(newBlog._id)) {
				result.posts.push(newBlog._id)
				await result.save()
			}
		})
		const unlink_res = await fsPromises.unlink(req.file.path)
		res.status(200).json(newBlog)
	} catch (error) {
		res.sendStatus(500).json({ message: error })
	}
}

const myBlogs = async (req, res) => {
	try {
		const { userId } = req.body
		if (!userId) res.status(403).json({ message: 'valid userId required' })

		const myBlogs = await Blog.find({ userId: userId })
			.select('title description content createdAt userId image.secure_url slug tags uid image.originalname')
			.populate([
				{ path: 'userId', select: 'displayName photos' },
				{ path: 'profile', select: 'username' },
			])
			.sort({ createdAt: -1 })

		if (myBlogs?.length) {
			return res.status(200).json(myBlogs)
		}
		res.status(200).json([])
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch post' })
	}
}
const allPost = async (req, res) => {
	try {
		const { limit } = req.query
		const allPost = await Blog.find()
			.populate([
				{ path: 'userId', select: 'displayName photos' },
				{ path: 'profile', select: 'username' },
			])
			.sort({ createdAt: -1 })
			.lean()
			.limit(limit)
			.select('title description content createdAt userId image.secure_url slug tags uid image.originalname')
		if (!allPost?.length) return res.sendStatus(404)
		res.status(200).json(allPost)
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch post' })
	}
}
const skipPost = async (req, res) => {
	try {
		const { skip } = req.query
		const allPost = await Blog.find()
			.populate([
				{ path: 'userId', select: 'displayName photos' },
				{ path: 'profile', select: 'username' },
			])
			.sort({ createdAt: -1 })
			.lean()
			.skip(skip)
			.limit(4)
			.select('title description content createdAt userId image.secure_url slug tags uid image.originalname')
		if (!allPost?.length) return res.sendStatus(404)
		res.status(200).json(allPost)
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch post' })
	}
}
const allTags = async (req, res) => {
	try {
		const allTags = await Tags.find().select('tag').limit(6).sort({ count: -1 })
		if (!allTags?.length) return res.sendStatus(404)
		res.status(200).json(allTags)
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch tags' })
	}
}

const tagPosts = async (req, res) => {
	try {
		const { tagId } = req.query
		const tagPost = await Tags.findOne({ _id: tagId }).populate(
			'posts',
			'title description content createdAt userId image.secure_url slug tags uid image.originalname profile'
		)
		if (!tagPost) throw new Error('server issue')
		if (tagPost?.posts.length) {
			const populatePromises = tagPost.posts.map((post) =>
				post.populate([
					{ path: 'userId', select: 'displayName photos' },
					{ path: 'profile', select: 'username' },
				])
			)
			await Promise.all(populatePromises)
			return res.status(200).json(tagPost.posts)
		}
		res.status(200).json([])
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch tag posts' })
	}
}

const readBlog = async (req, res) => {
	try {
		const { uid, slug } = req.query
		if (!uid || !slug) {
			return res.sendStatus(404)
		}
		const blogPost = await Blog.findOne({ uid: uid, slug: slug }).populate([
			{ path: 'userId', select: 'displayName photos' },
			{ path: 'profile', select: 'username' },
		])
		if (!blogPost) return res.sendStatus(404)
		res.status(200).json(blogPost)
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch post' })
	}
}

const editPost = async (req, res) => {
	try {
		const { title, description, content, tags, userId } = req.body
		const { id, slug } = req.query
		if (!userId || !title || !content) return res.sendStatus(403)
		if (!id || !slug) return res.sendStatus(400)

		const blogPost = await Blog.findOne({ _id: id })
		if (!blogPost) return res.sendStatus(404)

		const oldTags = blogPost.tags

		const updatedBlog = await Blog.updateOne(
			{ _id: id, slug: slug },
			{
				title: title,
				description: description,
				content: content,
				userId: userId,
				tags: JSON.parse(tags),
			}
		)
		const newTags = JSON.parse(tags)
		oldTags.forEach(async (tag) => {
			if (!newTags.includes(tag)) {
				await Tags.updateOne({ tag: tag }, { $pull: { posts: id } })
			}
		})
		newTags.forEach(async (tag) => {
			const result = await findOrCreate({ tag: tag }, Tags)
			if (!result.posts.includes(id)) {
				result.posts.push(id)
				await result.save()
			}
		})
		// if (!updatedBlog.modifiedCount) throw new Error('no update/modification')
		res.status(200).json({ message: 'successfully updated blog' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server failed to update post' })
	}
}

const deletePost = async (req, res) => {
	try {
		const { userId, id } = req.body

		if (!id || !userId) return res.sendStatus(400)

		const blogPost = await Blog.findOne({ _id: id }).select('image.public_id tags').populate('userId', '_id')
		if (!blogPost) return res.sendStatus(404)

		if (userId !== blogPost.userId.id) return res.sendStatus(401)

		await cloudinary.uploader.destroy(blogPost.image.public_id, { resource_type: 'image', type: 'upload' })
		await Blog.findOneAndDelete({ _id: id })
		res.status(200).json({ message: 'Successfully deleted post.' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server failed to delete post' })
	}
}

const checkBookmark = async (req, res) => {
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
}

const checkLike = async (req, res) => {
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
}

const bookmarkPost = async (req, res) => {
	try {
		const { userId, id, isBookmarked } = req.body

		if (!userId || !id) return res.sendStatus(400)

		const updateBookmark = isBookmarked ? { $pull: { bookmark: id } } : { $addToSet: { bookmark: id } }

		const bookmark = await Bookmark.findOneAndUpdate({ userId: userId }, updateBookmark, { new: true })

		if (!bookmark) {
			return res.sendStatus(404)
		}

		const message = isBookmarked ? 'Successfully removed bookmark' : 'Successfully added to bookmark'
		return res.status(200).json({ message })
	} catch (error) {
		return res.status(500).json({ message: 'Server failed to bookmark post' })
	}
}

const likePost = async (req, res) => {
	try {
		const { userId, id, isLiked } = req.body

		if (!userId || !id) return res.sendStatus(400)

		const updateUserLikes = isLiked ? { $pull: { like: id } } : { $addToSet: { like: id } }
		const updateBlogLikes = isLiked ? { $inc: { like: -1 } } : { $inc: { like: 1 } }

		const likeUpdate = await Like.findOneAndUpdate({ userId: userId }, updateUserLikes, { new: true })
		const blogUpdate = await Blog.findOneAndUpdate({ _id: id }, updateBlogLikes, { new: true })

		if (!likeUpdate || !blogUpdate) {
			return res.sendStatus(404)
		}
		return res.status(200).json(blogUpdate.like)
	} catch (error) {
		return res.status(500).json({ message: 'Server failed to like/unlike post' })
	}
}

const myBookmarks = async (req, res) => {
	try {
		const { userId } = req.body
		if (!userId) return res.sendStatus(400)

		const bookmark = await Bookmark.findOne({ userId: userId }).populate(
			'bookmark',
			'title description content createdAt userId image.secure_url slug tags uid image.originalname profile'
		)
		if (!bookmark) throw new Error('Error: server issue')
		if (bookmark?.bookmark.length) {
			const populatePromises = bookmark.bookmark.map((post) =>
				post.populate([
					{ path: 'userId', select: 'displayName photos' },
					{ path: 'profile', select: 'username' },
				])
			)
			await Promise.all(populatePromises)
			return res.status(200).json(bookmark.bookmark)
		}
		res.status(200).json([])
	} catch (error) {
		res.status(500).json({ message: 'server failed to send bookmark' })
	}
}

const searchPost = async (req, res) => {
	try {
		const { searchTerm } = req.body
		if (!searchTerm) return res.sendStatus(400)
		const regex = new RegExp(searchTerm, 'i')
		const blogPosts = await Blog.find({ title: { $regex: regex } })
			.sort({ createdAt: -1 })
			.limit(5)
			.select('title slug uid')
		const blogTags = await Tags.find({ tag: { $regex: regex } })
			.sort({ count: -1 })
			.limit(5)
			.select('tag')
		const userProfile = await Profile.find({ username: { $regex: regex } })
			.sort({ createdAt: -1 })
			.limit(5)
			.select('username')
		if (!blogPosts?.length && !blogTags?.length && !userProfile?.length)
			return res.json({ blogPosts: null, blogTags: null, profiles: null })
		if (blogPosts?.length || blogTags?.length || userProfile?.length) {
			return res.status(200).json({ blogPosts: blogPosts, blogTags: blogTags, profiles: userProfile })
		}
	} catch (error) {
		res.status(500).json({ message: 'server failed to search' })
	}
}
const searchQuery = async (req, res) => {
	try {
		const { paramValue } = req.body
		if (!paramValue) return res.sendStatus(400)
		const regex = new RegExp(paramValue, 'i')
		const searchPosts = await Blog.find({ title: { $regex: regex } })
			.select('title description content createdAt userId image.secure_url slug tags uid image.originalname')
			.populate([
				{ path: 'userId', select: 'displayName photos' },
				{ path: 'profile', select: 'username' },
			])
			.sort({ createdAt: -1 })
		const relatedTags = await Tags.find({ tag: { $regex: regex } }).select('tag')
		if (!searchPosts?.length) return res.json({ searchPosts: [], relatedTags: relatedTags })
		res.status(200).json({ searchPosts: searchPosts, relatedTags: relatedTags })
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch query' })
	}
}
const tagQuery = async (req, res) => {
	try {
		const { paramValue } = req.body
		if (!paramValue) return res.sendStatus(400)
		const tagPosts = await Tags.findOne({ tag: paramValue }).populate(
			'posts',
			'title description content createdAt userId image.secure_url slug tags uid image.originalname profile'
		)
		if (!tagPosts) throw new Error('Error: server issue')
		if (tagPosts?.posts.length) {
			const populatePromises = tagPosts.posts.map((post) =>
				post.populate([
					{ path: 'userId', select: 'displayName photos' },
					{ path: 'profile', select: 'username' },
				])
			)
			await Promise.all(populatePromises)
			return res.status(200).json(tagPosts.posts)
		}
		res.status(200).json([])
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch query' })
	}
}

const profile = async (req, res) => {
	try {
		const { username } = req.body
		if (!username) return res.sendStatus(400)
		const userProfile = await Profile.findOne({ username: username }).populate(
			'userId',
			'displayName email photos firstName lastName'
		)
		if (!userProfile) return res.sendStatus(404)
		res.status(200).json(userProfile)
	} catch (error) {
		res.status(500).json({ message: 'server failed to fetch profile' })
	}
}

const updateProfile = async (req, res, next) => {
	try {
		const { userId, profileId, firstName, lastName, description, about } = req.body
		if (!userId || !profileId || !firstName || !lastName) return res.sendStatus(400)
		const user = await User.findById(userId)
		if (!user) return res.sendStatus(404)
		const updateUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ firstName: firstName, lastName: lastName, displayName: `${firstName} ${lastName}` },
			{ new: true }
		)
		const updateUserProfile = await Profile.findOneAndUpdate(
			{ _id: profileId },
			{ description: description, about: about }
		)
		next()
	} catch (error) {
		res.status(500).json({ message: 'server failed to update profile' })
	}
}

const addComment = async (req, res, next) => {
	try {
		const { userId, id, comment } = req.body
		if (!userId || !id || !comment) return res.sendStatus(400)
		const { username } = await Profile.findOne({ userId: userId }).select('username')
		const createComment = await Comments.create({
			userId: userId,
			blogId: id,
			comment: comment,
			username: username,
		})
		const blogPost = await Blog.findOneAndUpdate(
			{ _id: id },
			{ $push: { comments: createComment._id } },
			{ new: true }
		)
		next()
	} catch (error) {
		res.status(500).json({ message: 'server failed to add comment' })
	}
}

const fetchComments = async (req, res) => {
	try {
		const { id } = req.body
		const commentCount = await Comments.find({ blogId: id }).select('_id')
		const allComments = await Blog.findOne({ _id: id }).populate('comments')
		if (!allComments) return res.sendStatus(404)
		if (allComments?.comments.length) {
			allComments.commentCount = commentCount.length
			await allComments.save()
			const populatePromises = allComments.comments.map((comment) =>
				comment.populate('userId', 'displayName photos')
			)
			await Promise.all(populatePromises)
			return res.status(200).json(allComments.comments)
		}
		res.status(200).json([])
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'server could not retrive comments' })
	}
}

const fetchReplies = async (req, res) => {
	try {
		const { commentId } = req.body
		const allReplies = await Comments.findOne({ _id: commentId }).populate('replies')
		if (!allReplies) return res.sendStatus(404)
		if (allReplies?.replies.length) {
			const populatePromises = allReplies.replies.map((reply) => reply.populate('userId', 'displayName photos'))
			await Promise.all(populatePromises)
			return res.status(200).json(allReplies.replies)
		}
		res.status(200).json([])
	} catch (error) {
		res.status(500).json({ message: 'server could not retrive replies' })
	}
}

const deleteRepliesRecursively = async (commentId) => {
	const comment = await Comments.findOne({ _id: commentId })
	if (comment) {
		for (const replyId of comment.replies) {
			await deleteRepliesRecursively(replyId)
		}
		await Comments.deleteOne({ _id: commentId })
	}
}

const deleteComment = async (req, res) => {
	try {
		const { commentId, userId } = req.body
		const comment = await Comments.findOne({ _id: commentId }).populate({
			path: 'blogId',
			select: 'userId',
			populate: { path: 'userId', select: '_id' },
		})
		if (!comment) return res.sendStatus(404)
		if (comment.userId == userId || comment.blogId.userId._id == userId) {
			await Comments.findOneAndUpdate({ replies: commentId }, { $pull: { replies: commentId } })
			const updatedBlog = await Blog.findOneAndUpdate(
				{ _id: comment.blogId },
				{ $pull: { comments: commentId } },
				{ new: true }
			)
			await deleteRepliesRecursively(commentId)
			const allComments = await Blog.findOne({ _id: updatedBlog._id }).populate('comments')
			const populatePromises = allComments.comments.map((comment) =>
				comment.populate('userId', 'displayName photos')
			)
			await Promise.all(populatePromises)
			return res.status(200).json(allComments.comments)
		}
		res.sendStatus(403)
	} catch (error) {
		res.status(500).json({ message: 'server failed to delete comment' })
	}
}

const replyComment = async (req, res, next) => {
	try {
		const { commentId, userId, id, comment } = req.body
		const originalComment = await Comments.findOne({ _id: commentId })
		if (!originalComment) return res.sendStatus(404)
		const reply = await Comments.create({
			blogId: id,
			userId: userId,
			comment: comment,
			depth: originalComment.depth + 1,
		})
		if (!reply) throw new Error('server issue')
		originalComment.replies.push(reply._id)
		await originalComment.save()
		next()
	} catch (error) {
		res.status(500).json({ message: 'server failed to post reply comment' })
	}
}

module.exports = {
	newPost,
	myBlogs,
	allPost,
	tagPosts,
	skipPost,
	allTags,
	readBlog,
	editPost,
	deletePost,
	checkBookmark,
	checkLike,
	bookmarkPost,
	likePost,
	myBookmarks,
	searchPost,
	searchQuery,
	tagQuery,
	profile,
	updateProfile,
	addComment,
	fetchComments,
	deleteComment,
	replyComment,
	fetchReplies,
}
