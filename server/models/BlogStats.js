const mongoose = require('mongoose')
const Schema = mongoose.Schema
const findOrCreate = require('mongoose-findorcreate')

const bookmarkSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	bookmark: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
})

const likeSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	like: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
})

bookmarkSchema.plugin(findOrCreate)
likeSchema.plugin(findOrCreate)

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)
const Like = mongoose.model('Like', likeSchema)

module.exports = { Bookmark, Like }
