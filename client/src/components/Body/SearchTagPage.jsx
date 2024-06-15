import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Feed from '../Posts/Feed'
import { ToastContext } from '../Context/ToastContext'

const SearchTagPage = () => {
	const { showToast } = useContext(ToastContext)
	const [queryParams] = useSearchParams()
	const navigate = useNavigate()
	const paramValue = queryParams.get('q')
	const [tagPosts, setTagPosts] = useState([])

	useEffect(() => {
		const fetchTagPosts = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tag-post`, {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({ paramValue: paramValue }),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('Failed to fetch tag posts.')
				const data = await response.json()
				data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				setTagPosts(data)
			} catch (error) {
				showToast(error.message)
			}
		}
		if (paramValue) fetchTagPosts()
		else navigate('/not-found')
	}, [paramValue])

	return (
		<main className="container">
			<div
				className="container pt-5 mt-3 display-5 fw-semibold heading d-flex flex-column gap-3"
				style={{ color: '#9a9a9a', textAlign: 'center' }}
			>
				<span className="d-flex gap-2 justify-content-center">
					<span className="text-warning">#</span>
					<span className="text-black">{paramValue}</span>
				</span>
				<span className="fw-normal" style={{ fontSize: '1.15rem', letterSpacing: '0px' }}>
					Topic <span className="fs-5">·</span> {tagPosts.length > 0 && tagPosts.length} stories
				</span>
			</div>
			<div className="grid-layout">{tagPosts && <Feed posts={tagPosts} isGrid={true} actag={paramValue} />}</div>
		</main>
	)
}
export default SearchTagPage
