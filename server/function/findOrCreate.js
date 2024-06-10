// const { Tags } = require('../models/BlogStats')

const findOrCreate = async (query, model) => {
	let doc = await model.findOne(query)
	if (!doc) {
		doc = await model.create(query)
	}
	return doc
}

module.exports = findOrCreate
