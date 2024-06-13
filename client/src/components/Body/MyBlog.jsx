import { useEffect, useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext'
import Feed from '../Posts/Feed'
import { ToastContext } from '../Context/ToastContext'

const MyBlog = ({ bookmarks }) => {
	const { user } = useContext(UserContext)
	const { showToast } = useContext(ToastContext)
	const [myPost, setMyPost] = useState()
	useEffect(() => {
		const fetchMyPost = async () => {
			try {
				const endpoint = bookmarks ? 'mybookmarks' : 'myblogs'
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/${endpoint}`, {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({
						userId: user._id,
					}),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('Failed to load blogs from the server.')
				const data = await response.json()
				setMyPost(data)
			} catch (error) {
				showToast(error.message)
			}
		}
		fetchMyPost()
	}, [user, bookmarks])
	return (
		<main className="container">
			<div className="grid-1">
				<div className="container pt-5 display-5 fw-semibold heading">
					Your {bookmarks ? 'Bookmarks' : 'Blogs'}:
				</div>
				{myPost && <Feed posts={myPost} />}
			</div>
		</main>
	)
}
export default MyBlog
