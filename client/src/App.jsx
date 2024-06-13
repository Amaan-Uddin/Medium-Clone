import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Body/Home'
import NewBlog from './components/Body/NewBlog'
import MyBlog from './components/Body/MyBlog'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import ReadBlog from './components/Body/ReadBlog'
import { UserContextProvider } from './components/Context/UserContext'
import EditBlog from './components/Body/EditBlog'
import LandingPage from './components/Body/LandingPage'
import Profile from './components/Body/Profile'
import EditProfile from './components/Body/EditProfile'
import SearchPage from './components/Body/SearchPage'
import SearchTagPage from './components/Body/SearchTagPage'
import ToastComponent from './components/Layout/Utils/ToastComponent'
import { ToastProvider } from './components/Context/ToastContext'
import NotFound from './components/Body/NotFound'

function App() {
	const location = useLocation()
	const navigate = useNavigate()

	const [posts, setPosts] = useState([])
	const [skip, setSkip] = useState(0)
	const [limit, setLimit] = useState(4)
	const [allTags, setAllTags] = useState([])

	const [user, setUser] = useState(() => {
		const user = localStorage.getItem('user')
		return user ? JSON.parse(user) : {}
	})

	useEffect(() => {
		if (location.pathname === '/') {
			if (user.loggedIn === true) navigate('/home', { replace: true })
		} else if (location.pathname === '/home') if (user.loggedIn === false) navigate('/', { replace: true })
	}, [user.loggedIn])

	useEffect(() => {
		const fetchAllPosts = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/all?limit=${limit}`, {
					credentials: 'include',
				})
				if (!response.ok) throw new Error('Failed to fetch all posts.')
				const data = await response.json()
				setPosts(data)
			} catch (error) {
				console.log(error.message)
			}
		}
		const fetchAllTags = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tags`, { credentials: 'include' })
				if (!response.ok) throw new Error('Something went wrong, server failed to fetch all tags.')
				const data = await response.json()
				setAllTags(data)
			} catch (error) {
				console.log(error.message)
			}
		}
		if (location.pathname === '/home') {
			fetchAllTags()
			fetchAllPosts()
		}
	}, [user, location.pathname])

	useEffect(() => {
		const fetchSkip = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/skip?skip=${skip}`, {
					credentials: 'include',
				})
				if (response.status === 404) {
					return setSkip(-1)
				}
				if (!response.ok) throw new Error('Failed to fetch more posts.')
				const data = await response.json()
				if (data.length) {
					setPosts([...posts, ...data])
				}
			} catch (error) {
				console.log(error.message)
			}
		}
		if (skip > 0) fetchSkip()
	}, [skip])

	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(user))
	}, [user]) // set user in localStorage

	useEffect(() => {
		localStorage.setItem(
			'BlogData',
			JSON.stringify({ title: '', description: '', content: '', tags: [], file: '' })
		)
	}) // do not add the dependency array as it would lead to the BlogData being persistent throughtout & will not reset the BlogData in the localStorage

	return (
		<>
			<UserContextProvider value={{ user, setUser }}>
				<ToastProvider>
					<ToastComponent />
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<LandingPage />}></Route>
							<Route
								path="home"
								element={
									<Home
										posts={posts}
										allTags={allTags}
										setPosts={setPosts}
										skip={skip}
										setSkip={setSkip}
										limit={limit}
										setLimit={setLimit}
									/>
								}
							></Route>
							<Route element={<ProtectedRoute />}>
								<Route path="new" element={<NewBlog />}></Route>
								<Route path="blogs" element={<MyBlog bookmarks={false} />}></Route>
								<Route path="read-blog/:post" element={<ReadBlog />}></Route>
								<Route path="edit/:post" element={<EditBlog />}></Route>
								<Route path="bookmarks" element={<MyBlog bookmarks={true} />}></Route>
								<Route path=":username" element={<Profile />}></Route>
								<Route path="edit/profile/:username" element={<EditProfile />}></Route>
								<Route path="search">
									<Route index element={<SearchPage />}></Route>
									<Route path="tag" element={<SearchTagPage />}></Route>
								</Route>
							</Route>
						</Route>
						<Route path="/not-found" element={<NotFound />}></Route>
						<Route path="*" element={<NotFound />}></Route>
					</Routes>
				</ToastProvider>
			</UserContextProvider>
		</>
	)
}

export default App
