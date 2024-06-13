import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { hourCheck } from '../../../public/scripts/utilities'
import DefaultPfp from '../../../public/logos/Default_pfp.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function getWordCount(content) {
	const cleanedString = content.replace(/<\/?[^>]+(>|$)/g, '')
	const wordsArray = cleanedString.split(/\s+/).filter((word) => word.length > 0)
	const readTimeMinutes = wordsArray.length / 200
	const roundedReadTimeMinutes = Math.ceil(readTimeMinutes) // Round up to the nearest minute
	return roundedReadTimeMinutes
}
const Post = ({ post, actag }) => {
	const [imageError, setImageError] = useState(false)
	const [src, setSrc] = useState(post.userId.photos[0])
	return (
		<article className="d-flex gap-4 py-5 border-bottom align-items-center">
			<div className="d-flex flex-column align-items-start blog-container">
				<div className="d-flex gap-2 align-items-center mb-2">
					<Link to={`/${post.profile.username}`} className="d-flex gap-2 align-items-center">
						<div className="blog profile-pic">
							<img
								src={src}
								alt=""
								onError={() => {
									setSrc(DefaultPfp)
								}}
							/>
						</div>
						<p className="author m-0">{post.userId.displayName}</p>
					</Link>
					<div className="d-flex gap-2 align-items-center">
						<span className="text-black fs-5">·</span>
						<p className="datetime m-0">
							{hourCheck(post.createdAt)
								? format(new Date(post.createdAt), 'MMMM dd, yyyy')
								: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
						</p>
					</div>
				</div>
				<Link to={`/read-blog/${post.slug}-${post.uid}`}>
					<h3 className="blog-title">{post.title}</h3>
					<p className="text text-black">{post.description}</p>
				</Link>
				<div className="d-flex gap-3 mt-4 flex-wrap align-items-center">
					{actag && (
						<Link className="text-black" to={`/search/tag?q=${actag.tag}`}>
							<button
								className="btn rounded-5 py-2 px-4 bg-light"
								style={{ fontSize: '.8rem', fontWeight: '500' }}
							>
								{actag.tag}
							</button>
						</Link>
					)}
					{!actag &&
						post.tags.slice(0, 1).map((tag, index) => (
							<Link key={index} className="text-black" to={`/search/tag?q=${tag}`}>
								<button
									className="btn rounded-5 py-2 px-4 bg-light"
									style={{ fontSize: '.8rem', fontWeight: '500' }}
								>
									{tag}
								</button>
							</Link>
						))}
					<p className="read-time">{getWordCount(post.content)} min read</p>
				</div>
			</div>
			<div className="blog-image">
				{!imageError ? (
					<img
						src={post.image.secure_url}
						alt="show img"
						onError={() => {
							setImageError(true)
						}}
					/>
				) : (
					<Skeleton width={'100%'} height={'100%'} className="d-block rounded-3"></Skeleton>
				)}
			</div>
		</article>
	)
}
const GridPost = ({ post, actag }) => {
	const [imageError, setImageError] = useState(false)
	const [src, setSrc] = useState(post.userId.photos[0])
	return (
		<article className="d-flex flex-column gap-3 py-5 border-bottom align-items-start">
			<div className="blog-image grid-image">
				{!imageError ? (
					<img
						src={post.image.secure_url}
						alt="show img"
						onError={() => {
							setImageError(true)
						}}
					/>
				) : (
					<Skeleton width={'100%'} height={'100%'} className="d-block rounded-3"></Skeleton>
				)}
			</div>
			<div className="d-flex flex-column align-items-start pt-3">
				<div className="d-flex gap-2 align-items-center mb-2">
					<Link to={`/${post.profile.username}`} className="d-flex gap-2 align-items-center">
						<div className="blog profile-pic">
							<img
								src={src}
								alt=""
								onError={() => {
									setSrc(DefaultPfp)
								}}
							/>
						</div>
						<p className="author m-0">{post.userId.displayName}</p>
					</Link>
					<div className="d-flex gap-2 align-items-center">
						<span className="text-black fs-5">·</span>
						<p className="datetime m-0">
							{hourCheck(post.createdAt)
								? format(new Date(post.createdAt), 'MMMM dd, yyyy')
								: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
						</p>
					</div>
				</div>
				<Link to={`/read-blog/${post.slug}-${post.uid}`}>
					<h3 className="blog-title">{post.title}</h3>
					<p className="text text-black">{post.description}</p>
				</Link>
				<div className="d-flex gap-3 mt-4 flex-wrap align-items-center">
					{actag && (
						<button
							className="btn rounded-5 py-2 px-4 bg-light"
							style={{ fontSize: '.8rem', fontWeight: '500' }}
						>
							{actag}
						</button>
					)}
					{!actag &&
						post.tags.slice(0, 1).map((tag, index) => (
							<button
								key={index}
								className="btn rounded-5 py-2 px-4 bg-light"
								style={{ fontSize: '.8rem', fontWeight: '500' }}
							>
								{tag}
							</button>
						))}
					<p className="read-time">{getWordCount(post.content)} min read</p>
				</div>
			</div>
		</article>
	)
}

export default Post
export { GridPost }
