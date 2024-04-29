import { useEffect, useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext'
import Feed from '../Posts/Feed'

const MyBlog = ({ bookmarks }) => {
	const { user } = useContext(UserContext)
	const [myPost, setMyPost] = useState([])
	useEffect(() => {
		const fetchMyPost = async () => {
			try {
				const url = bookmarks ? '/mybookmarks' : '/myblogs'
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({
						userId: user._id,
					}),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('ERROR: Failed to fetch data from the server')
				const data = await response.json()
				setMyPost(data)
				console.log(data)
			} catch (error) {
				console.error(error)
			}
		}
		fetchMyPost()
	}, [user, bookmarks])
	return <main className="container">{myPost && <Feed posts={myPost} />}</main>
}
export default MyBlog
