import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import Home from './components/Body/Home'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import NewBlog from './components/Body/NewBlog'
import MyBlog from './components/Body/MyBlog'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { UserContextProvider } from './components/Context/UserContext'

function App() {
	const logoPath = '/logos/symbol.png'

	const [articles, setArticles] = useState([
		{
			id: '1',
			title: 'This is the heading of the first blog post',
			datetime: 'July 01, 2021',
			author: 'xyz author name',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corr',
			body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!',
			tags: ['software development', 'backend dev', 'MERN stack'],
		},
		{
			id: '2',
			title: 'this is the heading of the second blog post',
			datetime: 'July 01, 2021',
			author: 'xyz author name',
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corr',
			body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!',
			tags: ['software development', 'backend dev', 'MERN stack'],
		},
	])

	const [user, setUser] = useState(() => {
		const user = localStorage.getItem('user')
		return user ? JSON.parse(user) : {}
	})

	return (
		<>
			<UserContextProvider value={{ user, setUser }}>
				<Routes>
					<Route path="/" element={<Layout logo={logoPath} />}>
						<Route index element={<Home articles={articles} />}></Route>
						<Route path="u" element={<ProtectedRoute />}>
							<Route path="new-blog" element={<NewBlog />}></Route>
							<Route path="my-blog" element={<MyBlog />}></Route>
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
