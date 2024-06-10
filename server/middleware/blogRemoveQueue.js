const Queue = require('bull')
const { Bookmark, Like, Tags } = require('../models/BlogStats')
const Comments = require('../models/Comments')

// Create a new Bull queue
const removeBlogFromBookmarksQueue = new Queue('removeBlogFromBookmarks', {
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
		maxRetriesPerRequest: 20, // Increase this value as needed
	},
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true,
	},
})

const removeBlogFromLikesQueue = new Queue('removeBlogFromLikes', {
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
		maxRetriesPerRequest: 20, // Increase this value as needed
	},
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true,
	},
})

const removeBlogFromTagsQueue = new Queue('removeBlogFromTags', {
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
		maxRetriesPerRequest: 20, // Increase this value as needed
	},
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true,
	},
})
const removeCommentsQueue = new Queue('removeComments', {
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
		maxRetriesPerRequest: 20, // Increase this value as needed
		defaultJobOptions: {
			removeOnComplete: true,
			removeOnFail: true,
		},
	},
})

// Define a processor for the queue
removeBlogFromBookmarksQueue.process(async (job, done) => {
	const blogId = job.data.blogId
	try {
		await Bookmark.updateMany({ bookmark: blogId }, { $pull: { bookmark: blogId } })
		console.log(`Blog with id ${blogId} removed from all bookmarks.`)
		done()
	} catch (error) {
		console.error(`Error removing blog from bookmarks: ${error.message}`)
		done(error)
	}
})
removeBlogFromLikesQueue.process(async (job, done) => {
	const blogId = job.data.blogId
	try {
		await Like.updateMany({ like: blogId }, { $pull: { like: blogId } })
		console.log(`Blog with id ${blogId} removed from all likes.`)
		done()
	} catch (error) {
		console.error(`Error removing blog from likes: ${error.message}`)
		done(error)
	}
})
removeBlogFromTagsQueue.process(async (job, done) => {
	const blogId = job.data.blogId
	try {
		await Tags.updateMany({ posts: blogId }, { $pull: { posts: blogId } })
		console.log(`Blog with id ${blogId} removed from all tags.`)
		done()
	} catch (error) {
		console.error(`Error removing blog from tags: ${error.message}`)
		done(error)
	}
})
removeCommentsQueue.process(async (job, done) => {
	const blogId = job.data.blogId
	try {
		await Comments.deleteMany({ blogId: blogId })
		console.log(`Comments with blogId ${blogId} removed from comments db.`)
		done()
	} catch (error) {
		console.error(`Error removing comments from Comments db: ${error.message}`)
		done(error)
	}
})

module.exports = {
	removeBlogFromBookmarksQueue,
	removeBlogFromLikesQueue,
	removeBlogFromTagsQueue,
	removeCommentsQueue,
}
