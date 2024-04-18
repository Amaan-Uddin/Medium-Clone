import { useEffect, useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext'
import Feed from '../Posts/Feed'

const MyBlog = () => {
	const { user } = useContext(UserContext)
	const [myPost, setMyPost] = useState([])
	useEffect(() => {
		const fetchMyPost = async () => {
			try {
				const response = await fetch('http://localhost:5000/my-post', {
					credentials: 'include', // important if you want the api to check the user is authenticated or not
					method: 'POST',
					headers: {
						'Content-Type': 'application/json', // Specify JSON content type
					},
					body: JSON.stringify({
						userId: user._id,
					}),
				})
				if (!response.ok) throw new Error('Failed to fetch your post(s) from the server')
				const data = await response.json()
				setMyPost(data)
				console.log(data)
			} catch (error) {
				console.error(error)
			}
		}
		fetchMyPost()
	}, [user])
	return <main className="container">{myPost && <Feed posts={myPost} />}</main>
}
export default MyBlog
