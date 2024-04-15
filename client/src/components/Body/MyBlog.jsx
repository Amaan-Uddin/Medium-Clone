import { useEffect, useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext'

const MyBlog = () => {
	const { user } = useContext(UserContext)
	const [myPost, setMyPost] = useState([])

	useEffect(() => {
		try {
			const fetchMyPost = async () => {
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
				const data = await response.json()
				console.log(data)
			}
			fetchMyPost()
		} catch (error) {
			console.error(error)
		}
	}, [user])
	return (
		<main>
			<section className="container d-flex align-items-center flex-column gap-3"></section>
		</main>
	)
}
export default MyBlog
