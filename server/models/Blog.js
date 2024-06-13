const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const {
	removeBlogFromBookmarksQueue,
	removeBlogFromLikesQueue,
	removeBlogFromTagsQueue,
	removeCommentsQueue,
} = require('../middleware/blogRemoveQueue')
const DOMpurify = createDomPurify(new JSDOM('').window)

const BlogSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
	content: {
		type: String,
		required: true,
	},
	image: {
		public_id: {
			type: String,
			required: true,
		},
		format: String,
		url: {
			type: String,
			required: true,
		},
		secure_url: {
			type: String,
			required: true,
		},
		originalname: String,
	},
	tags: [
		{
			type: String,
		},
	],
	slug: {
		type: String,
		required: true,
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comments',
		},
	],
	commentCount: { type: Number, default: 0 },
	like: { type: Number, default: 0 },
	createdAt: {
		type: Date,
		default: Date.now,
	},
	uid: String,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // This should match the model name for the user schema
		required: true,
	},
	profile: {
		type: Schema.Types.ObjectId,
		ref: 'Profile',
	},
})

/**
 * @note () => {...} arrow functions do not bind `this` values
 */

BlogSchema.pre('validate', function (next) {
	if (this.title) {
		this.slug = slugify(this.title, { lower: true, strict: true })
	}
	if (this.content) {
		this.content = DOMpurify.sanitize(this.content)
	}
	const objId = this._id.toString()
	this.uid = `${objId.slice(0, 8)}-${objId.slice(-6)}`
	next()
})

BlogSchema.pre('updateOne', async function (next) {
	const update = this.getUpdate()
	if (update.content) {
		update.content = DOMpurify.sanitize(update.content)
	}
	next()
})
BlogSchema.pre('findOneAndDelete', async function (next) {
	const docToDelete = await this.model.findOne(this.getFilter())
	this._docToDelete = docToDelete // Store the document to be deleted
	next()
})

// Post-findOneAndDelete hook
BlogSchema.post('findOneAndDelete', async function (doc, next) {
	if (this._docToDelete) {
		removeBlogFromBookmarksQueue.add({ blogId: this._docToDelete._id })
		removeBlogFromLikesQueue.add({ blogId: this._docToDelete._id })
		removeBlogFromTagsQueue.add({ blogId: this._docToDelete._id })
		removeCommentsQueue.add({ blogId: this._docToDelete._id })
		console.log(
			`Jobs added to queues to remove blog with id ${this._docToDelete._id} from bookmarks, likes, tags and comments.`
		)
	}
	next()
})

BlogSchema.index({ title: 'text' })

module.exports = mongoose.model('Blog', BlogSchema)
