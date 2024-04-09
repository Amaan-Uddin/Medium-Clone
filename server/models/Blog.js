const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
		fileId: Schema.Types.ObjectId,
		filename: {
			type: String,
			required: true,
		},
		contentType: {
			type: String,
			required: true,
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // This should match the model name for the user schema
		required: true,
	},
})

module.exports = mongoose.model('Blog', BlogSchema)
