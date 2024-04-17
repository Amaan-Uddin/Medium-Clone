import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import Home from './components/Body/Home'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import NewBlog from './components/Body/NewBlog'
import MyBlog from './components/Body/MyBlog'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import ReadBlog from './components/Body/ReadBlog'
import { UserContextProvider } from './components/Context/UserContext'

function App() {
	const logoPath = '/logos/symbol.png'

	const [posts, setPosts] = useState([])

	const [user, setUser] = useState(() => {
		const user = localStorage.getItem('user')
		return user ? JSON.parse(user) : {}
	})

	useEffect(() => {
		const fetchAllPosts = async () => {
			try {
				const response = await fetch('http://localhost:5000/all', {
					credentials: 'include',
				})
				if (!response.ok) throw new Error('Failed to fetch posts')
				const data = await response.json()
				console.log(data)
				setPosts(data)
			} catch (error) {
				console.error(error)
			}
		}
		fetchAllPosts()
	}, [user])

	return (
		<>
			<UserContextProvider value={{ user, setUser }}>
				<Routes>
					<Route path="/" element={<Layout logo={logoPath} />}>
						<Route index element={<Home posts={posts} />}></Route>
						<Route path="u" element={<ProtectedRoute />}>
							<Route path="new-blog" element={<NewBlog />}></Route>
							<Route path="my-blogs" element={<MyBlog />}></Route>
							<Route path="read-blog" element={<ReadBlog />}></Route>
						</Route>
					</Route>
					<Route path="signup" element={<Signup />}></Route>
					<Route path="login" element={<Login />}></Route>
				</Routes>
			</UserContextProvider>
		</>
	)
}

export default App
