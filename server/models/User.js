const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: String,
	googleId: String,
	firstName: {
		type: String,
		required: true,
	},
	lastName: String,
	displayName: String,
	photos: [String],
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('User', UserSchema)
