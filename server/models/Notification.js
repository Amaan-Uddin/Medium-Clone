const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	profile: {
		type: Schema.Types.ObjectId,
		ref: 'Profile',
	},
	content: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Notifications', NotificationSchema)
