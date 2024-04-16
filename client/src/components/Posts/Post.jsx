import { Link } from 'react-router-dom'
import React from 'react'
import { format, formatDistanceToNow } from 'date-fns'

const Post = ({ post }) => {
	function renderHTML(content) {
		const htmlArray = new DOMParser().parseFromString(content, 'text/html').body.childNodes

		const reactElements = Array.from(htmlArray).map((node, index) => {
			return React.createElement(node.tagName.toLowerCase(), { key: index }, node.textContent)
		})

		return reactElements
	}

	const renderedContent = renderHTML(post.content)

	return (
		<article className="d-flex gap-4 py-5 border-bottom">
			<div className="blog-image">
				<img src={post.image.secure_url} alt="show img" />
			</div>
			<div className="d-flex flex-column align-items-start">
				<Link to={'/'}>
					<div className="d-flex gap-2 align-items-center mb-2">
						<div className="blog profile-pic">
							<img src={post.userId.photos[0]} alt="" />
						</div>
						<p className="author m-0">{post.userId.displayName}</p>
						<p className="datetime m-0">
							{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							{/* add condition if > 24hours, then use {format(new Date(post.createdAt), 'MMMM dd, yyyy')} */}
						</p>
					</div>
					<h3 className="blog-title">{post.title}</h3>
				</Link>
				<p className="text">{post.description}</p>
				<p className="text">
					{renderedContent}
					{/* {post.content.length <= 50 ? post.content : `${post.content.slice(0, 50)}...`} */}
				</p>
				<div className="d-flex gap-2 tags justify-self-end">
					{/* {post.tags.map((tag) => (
						<button key={tag} className="btn tag px-3 py-2">
							{tag}
						</button>
					))} */}
				</div>
			</div>
		</article>
	)
}
export default Post
