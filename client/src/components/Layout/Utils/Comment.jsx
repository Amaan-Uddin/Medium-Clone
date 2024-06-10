import { useContext, useEffect, useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { hourCheck } from '../../../../public/scripts/utilities'
import DefaultPfp from '../../../../public/logos/Default_pfp.svg'
import { UserContext } from '../../Context/UserContext'
import ReplySection from './ReplySection'
import { ToastContext } from '../../Context/ToastContext'

const Comment = ({ comment, author, setAllComments, setIsReply, textareaRef }) => {
	const { user } = useContext(UserContext)
	const { showToast } = useContext(ToastContext)
	const [src, setSrc] = useState()
	const [replies, setReplies] = useState('')
	const [showReplies, setShowReplies] = useState(false)

	async function deleteComment() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/delete-comment`, {
				method: 'DELETE',
				credentials: 'include',
				body: JSON.stringify({ commentId: comment._id, userId: user._id }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Failed to delete comment.')
			const data = await response.json()
			data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			setAllComments(data)
			showToast('Successfully deleted comment.')
		} catch (error) {
			showToast(error.message)
		}
	}

	async function fetchReplies() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/fetch-replies`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ commentId: comment._id }),
				headers: {
					'Content-type': 'application/json',
				},
			})
			if (!response.ok) throw new Error('Failed to fetch replies.')
			const data = await response.json()
			setReplies(data)
		} catch (error) {
			showToast(error.message)
		}
	}

	const toggleReplies = () => {
		if (showReplies) {
			setReplies([])
		} else {
			fetchReplies()
		}
		setShowReplies(!showReplies)
	}

	useEffect(() => {
		setSrc(comment.userId.photos[0])
	}, [comment])

	return (
		<div className="container my-2 border-1 border pt-2 pb-3 px-3">
			<div className="d-flex justify-content-between">
				<div className="d-flex gap-2 align-items-center justify-content-start">
					<Link to={`/${comment.username}`} className="d-flex align-items-center gap-2">
						<div className="profile-pic comment">
							<img
								src={src}
								alt=""
								onError={() => {
									setSrc(DefaultPfp)
								}}
							/>
						</div>
						<p className="author m-0">{comment.userId.displayName}</p>
					</Link>
					<div className="d-flex gap-2 align-items-center">
						<span className="text-black fs-5">·</span>
						<p className="datetime comment m-0">
							{hourCheck(comment.createdAt)
								? format(new Date(comment.createdAt), 'MMMM dd, yyyy')
								: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
						</p>
					</div>
				</div>
				<div className="dropdown">
					<button
						className="btn border-0 dropdown-toggle"
						type="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						...
					</button>
					<ul className="dropdown-menu">
						<li>
							<button
								className="dropdown-item text-secondary d-flex gap-2"
								onClick={() => {
									setIsReply({ commentId: comment._id })
									textareaRef.current.focus()
								}}
							>
								Reply
								<p style={{ transform: 'scaleX(-1)' }}>
									<i className="uil uil-share"></i>
								</p>
							</button>
						</li>
						{(user._id === comment.userId._id || user._id === author) && (
							<li>
								<button className="dropdown-item text-danger" onClick={deleteComment}>
									Delete
								</button>
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className="container">
				<p style={{ paddingLeft: '18px' }} className="fs-6">
					{comment.comment}
				</p>
				{comment.replies && comment.replies.length > 0 && (
					<div className="container d-flex justify-content-start py-2">
						<button className="show-more-btn text-primary" onClick={toggleReplies}>
							{showReplies ? 'Hide replies' : 'Show replies'}
						</button>
					</div>
				)}
			</div>
			{showReplies && replies.length > 0 && (
				<ReplySection
					comments={replies}
					author={author}
					setAllComments={setAllComments}
					setIsReply={setIsReply}
					textareaRef={textareaRef}
				/>
			)}
		</div>
	)
}
export default Comment
