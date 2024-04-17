import { Link } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'

const Post = ({ post }) => {
	function hourCheck(blogDate) {
		const newDate = new Date().getTime()
		const oldDate = new Date(blogDate).getTime()
		const timeDiff = newDate - oldDate
		return timeDiff > 24 * 60 * 60 * 1000 // * 7 (multiply by 7 for appliying the changes if the post is older than 1 week)
	}
	return (
		<article className="d-flex gap-4 py-5 border-bottom">
			<div className="blog-image">
				<img src={post.image.secure_url} alt="show img" />
			</div>
			<div className="d-flex flex-column align-items-start">
				<Link to={`/u/read-blog?id=${post._id}&post=${post.slug}`}>
					<div className="d-flex gap-2 align-items-center mb-2">
						<div className="blog profile-pic">
							<img src={post.userId.photos[0]} alt="" />
						</div>
						<p className="author m-0">{post.userId.displayName}</p>
						<p className="datetime m-0">
							{hourCheck(post.createdAt)
								? format(new Date(post.createdAt), 'MMMM dd, yyyy')
								: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
						</p>
					</div>
					<h3 className="blog-title">{post.title}</h3>
				</Link>
				<p className="text">{post.description}</p>
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
