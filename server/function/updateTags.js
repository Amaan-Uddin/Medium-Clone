const { Tag } = require('../models/BlogStats') // Adjust the path as necessary

async function updateTags(tags) {
	try {
		// Get the single document that holds all tags
		let allTags = await Tag.findOne()

		// If no document exists, create one
		if (!allTags) {
			allTags = await Tag.create({ tags: [] })
		}

		// Add new tags to the array
		tags.forEach((tag) => {
			if (!allTags.tags.includes(tag)) {
				allTags.tags.push(tag)
			}
		})

		// Save the updated document
		await allTags.save()
	} catch (error) {
		console.error('Error updating tags:', error)
		throw error
	}
}

module.exports = updateTags
