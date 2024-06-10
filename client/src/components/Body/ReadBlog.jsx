import { useEffect, useState, useContext, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { UserContext } from '../Context/UserContext'
import Modal from '../Layout/Utils/Modal'
import { hourCheck } from '../../../public/scripts/utilities'
import DefaultPfp from '../../../public/logos/Default_pfp.svg'
import CommentSection from '../Layout/Utils/CommentSection'
import { ToastContext } from '../Context/ToastContext'

const ReadBlog = () => {
	const navigate = useNavigate()

	const { user } = useContext(UserContext)
	const { showToast } = useContext(ToastContext)

	const [blog, setBlog] = useState()
	const [bookmark, setBookmark] = useState()

	const [like, setLike] = useState()
	const [likeCount, setLikeCount] = useState()

	const [src, setSrc] = useState('')
	const [comment, setComment] = useState('')
	const [allComments, setAllComments] = useState('')
	const textareaRef = useRef(null)
	const [isReply, setIsReply] = useState({ commentId: null })

	const { post } = useParams()
	const uid = post.slice(-15)
	const slug = post.slice(0, -16)

	function adjustTextareaHeight() {
		const textarea = textareaRef.current
		if (textarea) {
			textarea.style.height = 'auto'
			textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
		}
	}
	function handleEdit(e) {
		e.preventDefault()
		navigate(`/edit/${post}`, {
			state: {
				edit: true,
				BlogData: {
					id: blog._id,
					slug: slug,
					title: blog.title,
					description: blog.description,
					content: blog.content,
					tags: blog.tags,
					file: blog.image.secure_url,
					originalname: blog.image.originalname,
					userId: blog.userId._id,
				},
			},
		})
	}
	async function deletePost(e) {
		e.preventDefault()
		if (user._id === blog.userId._id) {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/delete`, {
					method: 'DELETE',
					credentials: 'include',
					body: JSON.stringify({ userId: user._id, id: blog._id }),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('Server failed to delete post.')
				const message = await response.json()
				navigate('/blogs', { replace: true })
				document.querySelector('.modal-backdrop').remove()
				showToast(message)
				window.location.reload()
			} catch (error) {
				showToast(error.message)
			}
		}
	}
	async function handleInteraction(e) {
		e.preventDefault()
		const targetId = e.target.id
		try {
			const endpoint = targetId === 'like' ? `like` : `bookmark`
			const body = targetId === 'like' ? { isLiked: like } : { isBookmarked: bookmark }

			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/${endpoint}`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ userId: user._id, id: blog._id, ...body }),
				headers: { 'Content-type': 'application/json' },
			})
			if (!response.ok) throw new Error(`Failed to update ${targetId === 'like' ? 'likes' : 'bookmark'}`)
			const data = await response.json()

			if (targetId === 'bookmark') showToast(`Post ${!bookmark ? 'added to' : 'removed from'} bookmarks.`)

			if (targetId === 'like') {
				setLikeCount(data)
				checkLike()
			} else {
				checkBookmark()
			}
		} catch (error) {
			showToast(error.message)
		}
	}
	async function checkBookmark() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/check-bookmark?id=${blog._id}`, {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify({ userId: user._id }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Something went wrong, server failed to check bookmark status.')
			const data = await response.json()
			setBookmark(data)
		} catch (error) {
			showToast(error.message)
		}
	}
	async function checkLike() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/check-like?id=${blog._id}`, {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify({ userId: user._id }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Something went wrong, server failed to check like status.')
			const data = await response.json()
			setLike(data)
		} catch (error) {
			showToast(error.message)
		}
	}
	async function addComment() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-comment`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ userId: user._id, id: blog._id, comment: comment }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Failed to add comment.')
			const data = await response.json()
			data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			setAllComments(data)
			showToast('Comment added successfully')
			textareaRef.current.value = ''
		} catch (error) {
			showToast(error.message)
		}
	}
	async function replyComment() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/reply-comment`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({
					commentId: isReply.commentId,
					userId: user._id,
					id: blog._id,
					comment: comment,
				}),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Failed to add reply.')
			const data = await response.json()
			data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			setAllComments(data)
			setIsReply({ commentId: null })
			textareaRef.current.value = ''
			showToast('Reply added successfully.')
		} catch (error) {
			showToast(error.message)
		}
	}
	async function fetchAllComments() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/fetch-comments`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ id: blog._id }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Failed to fetch comments.')
			const data = await response.json()
			data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			setAllComments(data)
		} catch (error) {
			showToast(error.message)
		}
	}

	useEffect(() => {
		const fetchBlogPost = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/api/read-blog?uid=${uid}&slug=${slug}`,
					{
						credentials: 'include',
					}
				)
				if (!response.ok) throw new Error('Error: Failed to fetch post')
				const data = await response.json()
				setBlog(data)
				setLikeCount(data.like)
				setSrc(data.userId.photos[0])
			} catch (error) {
				console.error(error)
			}
		}
		fetchBlogPost()
	}, [post])

	useEffect(() => {
		if (blog?._id) {
			checkBookmark()
			checkLike()
			fetchAllComments()
		}
	}, [blog])

	useEffect(() => {
		adjustTextareaHeight()
	}, [comment])

	return (
		<>
			{blog && (
				<main className="container my-5 d-flex justify-content-center">
					<article className="blog-box">
						<div className="details">
							<div>
								<h1 className="read-title">
									<b> {blog.title}</b>
								</h1>
								<h3 className="read-description">{blog.description}</h3>
							</div>
							<div className="d-flex my-4 align-items-center justify-content-between">
								<div className="d-flex gap-3 align-items-center">
									<div className="profile-pic">
										<img
											src={src}
											alt="show profile"
											onError={() => {
												setSrc(DefaultPfp)
											}}
										/>
									</div>
									<div className="d-flex flex-column ">
										<p className="read-author">{blog.userId.displayName}</p>
										<p className="read-datetime">
											Published&nbsp;
											{hourCheck(blog.createdAt) ? (
												<>
													on&nbsp;
													<span style={{ color: 'black', fontWeight: '400' }}>
														{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
													</span>
												</>
											) : (
												<>
													<span style={{ color: 'black', fontWeight: '400' }}>
														{formatDistanceToNow(new Date(blog.createdAt), {
															addSuffix: true,
														})}
													</span>
												</>
											)}
										</p>
									</div>
								</div>
								<div className="d-flex gap-3">
									{user._id === blog.userId._id ? (
										<>
											<button
												onClick={handleEdit}
												className="text-black py-1 border-0"
												style={{
													fontSize: '1.5rem',
													backgroundColor: 'transparent',
													fontWeight: '400',
												}}
											>
												<span style={{ fontSize: '1.1rem' }}>Edit</span>{' '}
												<i className="uil uil-edit"></i>
											</button>
											<button
												data-bs-toggle="modal"
												data-bs-target="#exampleModal"
												className="text-danger py-1 border-0"
												style={{ fontSize: '1.75rem', backgroundColor: 'transparent' }}
											>
												<i className="uil uil-trash-alt"></i>
											</button>
											<Modal deletePost={deletePost} />
										</>
									) : (
										''
									)}
								</div>
							</div>
						</div>
						<div
							className="d-flex border-top border-bottom align-items-center justify-content-between blog-stat-box"
							style={{ fontSize: '1.5rem' }}
						>
							<div className="d-flex gap-3 ">
								<div className="d-flex">
									<button
										className="btn stat-btn"
										id="like"
										onClick={handleInteraction}
										style={{ color: like ? 'rgb(13 110 253)' : 'black' }}
									>
										<i className="uil uil-thumbs-up" id="like"></i>
									</button>
									<span style={{ fontSize: '1.1rem', paddingTop: '12px' }} id="like">
										{likeCount}
									</span>
								</div>
								<div className="d-flex">
									<button
										className="btn stat-btn"
										onClick={() => {
											textareaRef.current.focus()
										}}
									>
										<i className="uil uil-comment"></i>
									</button>
									<span style={{ fontSize: '1.1rem', paddingTop: '12px' }}>
										{blog.comments.length}
									</span>
								</div>
							</div>
							<div>
								<button
									onClick={handleInteraction}
									className=" btn  stat-btn  "
									id="bookmark"
									style={{ color: bookmark ? 'rgb(13 110 253)' : 'black' }}
								>
									<i className="uil uil-bookmark" id="bookmark"></i>
								</button>
							</div>
						</div>
						<div className="cover-image mt-4 d-flex justify-content-center">
							<img src={blog.image.secure_url} alt="show cover" />
						</div>
						<div dangerouslySetInnerHTML={{ __html: blog.content }} className="read-content my-5"></div>
						<div className="d-flex gap-2 w-75 flex-wrap mb-5">
							{blog.tags.map((tag, index) => (
								<Link key={index} className="text-black" to={`/search/tag?q=${tag}`}>
									<button className="btn rounded-5 py-2 px-4  bg-light">{tag}</button>
								</Link>
							))}
						</div>
						{allComments && (
							<CommentSection
								comments={allComments}
								author={blog.userId._id}
								setAllComments={setAllComments}
								setIsReply={setIsReply}
								textareaRef={textareaRef}
							/>
						)}
						<div className="mt-3">
							<textarea
								ref={textareaRef}
								type="text"
								name="commentbox"
								id="commentbox"
								onChange={(e) => {
									setComment(e.target.value)
								}}
								placeholder="Comment"
								className="new-blog-inputs"
								rows="1"
								style={{ resize: 'none', overflow: 'hidden' }}
							/>
							<button
								className="btn border-0 bg-black fw-semibold rounded-0 text-white"
								onClick={isReply.commentId ? replyComment : addComment}
							>
								Comment
							</button>
						</div>
					</article>
				</main>
			)}
		</>
	)
}
export default ReadBlog
