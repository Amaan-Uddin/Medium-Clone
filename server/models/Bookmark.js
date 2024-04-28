const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

module.exports = mongoose.model('Bookmark', bookmarkSchema)
