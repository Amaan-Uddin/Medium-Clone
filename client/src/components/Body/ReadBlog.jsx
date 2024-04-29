import { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { UserContext } from '../Context/UserContext'
import Modal from '../Layout/Utils/Modal'
import { hourCheck } from '../../../public/scripts/utilities'

const ReadBlog = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const { user } = useContext(UserContext)

	const [blog, setBlog] = useState()
	const [bookmark, setBookmark] = useState()

	const [like, setLike] = useState()
	const [likeCount, setLikeCount] = useState()

	const queryParams = new URLSearchParams(location.search)
	const id = queryParams.get('id')
	const post = queryParams.get('post')

	async function handleInteraction(e) {
		e.preventDefault()
		const targetId = e.target.id
		try {
			const url = targetId === 'like' ? `/like` : `/bookmark`
			const body = targetId === 'like' ? { isLiked: like } : { isBookmarked: bookmark }

			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ userId: user._id, id: id, ...body }),
				headers: { 'Content-type': 'application/json' },
			})
			if (!response.ok) throw new Error(`ERROR: Failed to update ${targetId === 'like' ? 'like' : 'bookmark'}`)
			const data = await response.json()
			console.log(data)

			if (targetId === 'like') {
				setLikeCount(data)
				checkLike()
			} else {
				checkBookmark()
			}
		} catch (error) {
			console.error(error)
		}
	}

	function handleEdit(e) {
		e.preventDefault()
		navigate(`/u/edit/${post}`, {
			state: {
				edit: true,
				BlogData: {
					id: id,
					post: post,
					title: blog.title,
					description: blog.description,
					content: blog.content,
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
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/delete`, {
					method: 'DELETE',
					credentials: 'include',
					body: JSON.stringify({ userId: user._id, id: id }),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('Error: Failed to delete post')
				const data = await response.json()
				console.log(data)
				navigate('/u/blogs', { replace: true })
				document.querySelector('.modal-backdrop').remove()
				window.location.reload()
			} catch (error) {
				console.error(error)
			}
		}
	}

	async function checkBookmark() {
		try {
			const response = await fetch(`http://localhost:5000/check-bookmark?id=${id}`, {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify({ userId: user._id }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Failed to fetch bookmark')
			const data = await response.json()
			setBookmark(data)
		} catch (error) {
			console.error(error)
		}
	}

	async function checkLike() {
		try {
			const response = await fetch(`http://localhost:5000/check-like?id=${id}`, {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify({ userId: user._id }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Failed to fetch like')
			const data = await response.json()
			setLike(data)
		} catch (error) {
			console.error(error)
		}
	}
	useEffect(() => {
		const fetchBlogPost = async () => {
			try {
				const response = await fetch(`http://localhost:5000/read-blog?id=${id}&post=${post}`, {
					credentials: 'include',
				})
				if (!response.ok) throw new Error('Error: Failed to fetch post')
				const data = await response.json()
				console.log(data)
				setBlog(data)
				setLikeCount(data.like)
			} catch (error) {
				console.error(error)
			}
		}

		fetchBlogPost()
		checkBookmark()
		checkLike()
	}, [])

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
										<img src={blog.userId.photos[0]} alt="show profile" />
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
									<button className="btn stat-btn">
										<i className="uil uil-comment"></i>
									</button>
									<span style={{ fontSize: '1.1rem', paddingTop: '12px' }}>333</span>
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
					</article>
				</main>
			)}
		</>
	)
}
export default ReadBlog
