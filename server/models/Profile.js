const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema

const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const DOMpurify = createDomPurify(new JSDOM('').window)

const ProfileSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	username: {
		type: String,
		unique: true,
	},
	about: String,
	description: String,
})

ProfileSchema.pre('save', async function (next) {
	if (!this.username) {
		try {
			const user = await mongoose.model('User').findById(this.userId)
			if (user) {
				this.username = '@' + user.email.split('@')[0]
			} else {
				const err = new Error('User not found')
				next(err)
			}
		} catch (error) {
			next(error)
		}
	}
	next()
})

ProfileSchema.pre('updateOne', function (next) {
	const update = this.getUpdate()
	if (update.about) {
		update.about = DOMpurify.sanitize(update.content)
	}
})

ProfileSchema.plugin(findOrCreate)

const Profile = mongoose.model('Profile', ProfileSchema)
module.exports = Profile
