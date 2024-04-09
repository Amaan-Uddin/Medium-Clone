const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
	destination: './public/uploads',
	filename: function (req, file, cb) {
		cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
	},
})

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 10 },
	fileFilter: function (req, file, cb) {
		const fileExt = /jpeg|jpg|png/
		const extTest = fileExt.test(path.extname(file.originalname).toLocaleLowerCase())
		const mimeTest = fileExt.test(file.mimetype)
		if (extTest && mimeTest) return cb(null, true)
		else return cb('Images: only')
	},
})

module.exports = {
	uploadMiddleware: upload.single('file'),
}
