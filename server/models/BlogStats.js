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

const tagsSchema = new Schema({
	tag: {
		type: String,
		required: true,
		unique: true,
	},
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
	count: {
		type: Number,
		default: 0,
	},
})

tagsSchema.index({ tag: 'text' })

bookmarkSchema.plugin(findOrCreate)
likeSchema.plugin(findOrCreate)
tagsSchema.plugin(findOrCreate)

tagsSchema.pre('save', function (next) {
	this.count = this.posts.length
	next()
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)
const Like = mongoose.model('Like', likeSchema)
const Tags = mongoose.model('Tags', tagsSchema)

module.exports = { Bookmark, Like, Tags }
