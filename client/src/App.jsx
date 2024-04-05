import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import Home from './components/Body/Home'
import Login from './components/Auth/Login'

function App() {
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

	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home articles={articles} />}></Route>
					{/* <Route path='signup' element={}></Route> */}
				</Route>
				<Route path="login" element={<Login />}></Route>
			</Routes>
		</>
	)
}

export default App
