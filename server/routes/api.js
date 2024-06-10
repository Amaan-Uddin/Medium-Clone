const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { uploadMiddleware } = require('../middleware/uploadMiddleware')
const { userAuthenticated } = require('../middleware/checkAuth')
const {
	newPost,
	myBlogs,
	allPost,
	allTags,
	tagPosts,
	readBlog,
	editPost,
	deletePost,
	checkBookmark,
	checkLike,
	bookmarkPost,
	likePost,
	myBookmarks,
	skipPost,
	searchPost,
	searchQuery,
	tagQuery,
	profile,
	updateProfile,
	addComment,
	fetchComments,
	deleteComment,
	replyComment,
	fetchReplies,
} = require('../controllers/BlogConn')

router.use(userAuthenticated)
router.get('/all', allPost)
router.get('/skip', skipPost)
router.get('/tags', allTags)
router.get('/tag-posts', tagPosts)
router.get('/read-blog', readBlog)

router.post('/search', searchPost)
router.post('/query-post', searchQuery)
router.post('/tag-post', tagQuery)

router.post('/new', uploadMiddleware, newPost)
router.post('/myblogs', myBlogs)

router.post('/profile', profile)
router.post('/update-profile', updateProfile, async (req, res) => {
	const { userId } = req.body
	const user = await User.findById(userId)
	if (!user) return res.sendStatus(404)
	req.user = user
	res.status(200).json({ user: { ...req.user._doc, loggedIn: true } })
})

router.post('/check-bookmark', checkBookmark)
router.post('/check-like', checkLike)
router.post('/bookmark', bookmarkPost)
router.post('/like', likePost)
router.post('/mybookmarks', myBookmarks)

router.post('/add-comment', addComment, fetchComments)
router.post('/reply-comment', replyComment, fetchComments)
router.post('/fetch-comments', fetchComments)
router.post('/fetch-replies', fetchReplies)

router.put('/edit', editPost)

router.delete('/delete', deletePost)
router.delete('/delete-comment', deleteComment)

module.exports = router
