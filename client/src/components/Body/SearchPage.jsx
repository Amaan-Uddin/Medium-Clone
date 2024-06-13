import { useContext, useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import Feed from '../Posts/Feed'
import { LoaderBorder2 } from '../Layout/Utils/Loaders'
import { ToastContext } from '../Context/ToastContext'

const SearchPage = () => {
	const { showToast } = useContext(ToastContext)
	const [queryParams] = useSearchParams()
	const navigate = useNavigate()
	const paramValue = queryParams.get('q')
	const [isLoading, setIsLoading] = useState(true)
	const [searchPosts, setSearchPosts] = useState()

	useEffect(() => {
		const fetchSearchPosts = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/query-post`, {
					credentials: 'include',
					method: 'POST',
					body: JSON.stringify({ paramValue: paramValue }),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('Failed to fetch query posts.')
				const data = await response.json()
				setSearchPosts(data)
			} catch (error) {
				showToast(error.message)
			}
		}
		if (paramValue) fetchSearchPosts()
		else navigate('/not-found')
	}, [paramValue])

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	}, [])

	return (
		<main className="container d-flex">
			<div className="grid-1">
				<div className=" pt-5 display-5 fw-semibold heading" style={{ color: '#9a9a9a' }}>
					Results for <span className="text-black">{paramValue}</span>
				</div>
				{isLoading ? (
					<LoaderBorder2 />
				) : searchPosts?.searchPosts.length ? (
					<Feed posts={searchPosts.searchPosts} />
				) : (
					<div className="mt-5 display-5">{"We couldn't find what you're looking for"}</div>
				)}
			</div>
			<div className="grid-2 container">
				<div className=" pt-5 pb-3 display-5 fw-semibold sub heading">Related tags</div>
				<div>
					<ul className="d-flex flex-column overflow-x-auto align-items-start gap-2 justify-content-center search-list">
						{searchPosts?.relatedTags?.length
							? searchPosts.relatedTags.map((tag) => (
									<li className="d-flex gap-2 align-items-center" key={tag._id}>
										<span
											style={{ fontSize: '1.65em', fontWeight: '500' }}
											className="text-warning"
										>
											#
										</span>
										<Link
											className="search-result tags bg-white border border-1 rounded-5 py-1 px-3"
											style={{ fontSize: '1rem' }}
											to={`/search/tag?q=${tag.tag}`}
										>
											{tag.tag}
										</Link>
									</li>
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  ))
							: ''}
					</ul>
				</div>
			</div>
		</main>
	)
}
export default SearchPage
