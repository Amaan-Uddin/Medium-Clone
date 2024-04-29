const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
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
	slug: {
		type: String,
		required: true,
	},
	like: { type: Number, default: 0 },
	createdAt: {
		type: Date,
		default: Date.now,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // This should match the model name for the user schema
		required: true,
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
	next()
})

BlogSchema.pre('updateOne', async function (next) {
	const update = this.getUpdate()
	if (update.title) {
		update.slug = slugify(update.title, { lower: true, strict: true })
	}
	if (update.content) {
		update.content = DOMpurify.sanitize(update.content)
	}
	next()
})

module.exports = mongoose.model('Blog', BlogSchema)
