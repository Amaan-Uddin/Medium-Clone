import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'

const ReadBlog = () => {
	const location = useLocation()
	const [blog, setBlog] = useState()

	function hourCheck(blogDate) {
		const newDate = new Date().getTime()
		const oldDate = new Date(blogDate).getTime()
		const timeDiff = newDate - oldDate
		return timeDiff > 24 * 60 * 60 * 1000 // * 7 (multiply by 7 for appliying the changes if the post is older than 1 week)
	}

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search)
		const id = queryParams.get('id')
		const post = queryParams.get('post')
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
							<div className="d-flex gap-3 my-4 align-items-center">
								<div className="profile-pic">
									<img src={blog.userId.photos[0]} alt="show profile" />
								</div>
								<div className="d-flex flex-column ">
									<p className="read-author">{blog.userId.displayName}</p>
									<p className="read-datetime">
										Published&nbsp;
										{hourCheck(blog.createdAt)
											? `on` + format(new Date(blog.createdAt), 'MMMM dd, yyyy')
											: formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
									</p>
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
