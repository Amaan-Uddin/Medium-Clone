import { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { UserContext } from '../Context/UserContext'
import Modal from '../Layout/Utils/Modal'

const ReadBlog = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user } = useContext(UserContext)
	const [blog, setBlog] = useState()

	const queryParams = new URLSearchParams(location.search)
	const id = queryParams.get('id')
	const post = queryParams.get('post')

	function hourCheck(blogDate) {
		const newDate = new Date().getTime()
		const oldDate = new Date(blogDate).getTime()
		const timeDiff = newDate - oldDate
		return timeDiff > 24 * 60 * 60 * 1000 * 7 // (multiply by 7 for appliying the changes if the post is older than 1 week)
	}

	function handleEdit(e) {
		e.preventDefault()
		// const currentData = JSON.stringify({
		// 	title: blog.title,
		// 	description: blog.description,
		// 	content: blog.content,
		// 	file: blog.file,
		// })
		// localStorage.setItem('BlogData', currentData)
		navigate(`/u/edit?id=${id}&post=${post}`, {
			state: {
				edit: true,
				BlogData: {
					title: blog.title,
					description: blog.description,
					content: blog.content,
					file: blog.image.secure_url,
					id: blog.userId._id,
				},
			},
		})
	}
	async function deletePost(e) {
		e.preventDefault()
		document.querySelector('.modal').classList.remove('show')
		if (user._id === blog.userId._id) {
			try {
				const response = await fetch(`http://localhost:5000/delete?id=${id}`, {
					credentials: 'include',
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ user: user._id }),
				})
				if (!response.ok) throw new Error('Failed to delete post')
				const data = await response.json()
				console.log(data)
				navigate('/u/my-blogs', { replace: true })
				window.location.reload()
			} catch (error) {
				console.error(error)
			}
		}
	}

	useEffect(() => {
		const fetchBlogPost = async () => {
			try {
				const response = await fetch(`http://localhost:5000/read-blog?id=${id}&post=${post}`, {
					credentials: 'include',
				})
				if (!response.ok) throw new Error('Failed to fetch post')
				const data = await response.json()
				console.log(data)
				setBlog(data)
			} catch (error) {
				console.error(error)
			}
		}
		fetchBlogPost()
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
													fontWeight: '500',
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
