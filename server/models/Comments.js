const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentsSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	blogId: {
		type: Schema.Types.ObjectId,
		ref: 'Blog',
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	username: {
		type: String,
	},
	like: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	dislike: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	replies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comments',
		},
	],
	depth: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

const Comments = mongoose.model('Comments', CommentsSchema)

module.exports = Comments
