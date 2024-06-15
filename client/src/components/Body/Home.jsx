import { useContext, useEffect, useState } from 'react'
import Feed from '../Posts/Feed'
import { Loader, LoaderBorder2 } from '../Layout/Utils/Loaders'
import { ToastContext } from '../Context/ToastContext'

const Home = ({ allTags, posts, skip, setSkip, limit, setLimit }) => {
	const { showToast } = useContext(ToastContext)
	const [activeTag, setActiveTag] = useState(0)
	const [filter, setFilter] = useState()
	const [tagLoading, setTagLoading] = useState(true)
	const [isLoading, setIsLoading] = useState(true)

	async function fetchTagPosts(id) {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tag-posts?tagId=${id}`, {
				method: 'GET',
				credentials: 'include',
			})
			if (!response.ok) throw new Error('Failed to fetch tag posts')
			const data = await response.json()
			data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sorting from new to old
			setFilter(data)
		} catch (error) {
			showToast(error.message)
		} finally {
			setTimeout(() => {
				setTagLoading(false)
			}, 500)
		}
	}

	function getTagPost(id, index) {
		setActiveTag(index)
		if (!(index === 0)) fetchTagPosts(id)
	}

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false)
		}, 500)
	})

	return (
		<main className="d-flex gap-2 container position-relative">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className=" grid-1">
						<div className="all-tags container d-flex mt-3 w-100 overflow-x-auto ">
							<button
								key={0}
								id="All"
								className={`px-4 py-3 all-tags-btn ${activeTag === 0 ? 'focus' : ''}`}
								onClick={(e) => {
									getTagPost(e, 0)
								}}
							>
								All
							</button>
							{allTags.map((tag, index) => (
								<button
									key={tag._id}
									id={tag._id}
									className={`px-4 py-3 all-tags-btn ${activeTag === index + 1 ? 'focus' : ''}`}
									onClick={() => {
										getTagPost(tag._id, index + 1)
									}}
								>
									{tag.tag}
								</button>
							))}
						</div>
						{posts?.length ? (
							activeTag === 0 ? (
								<>
									<Feed posts={posts} />
									{skip !== -1 && posts.length > 3 ? (
										<div className="container d-flex justify-content-center py-2">
											<button
												className="show-more-btn"
												onClick={() => {
													setSkip(skip + 4)
													setLimit(limit + 4)
												}}
											>
												show more
											</button>
										</div>
									) : (
										''
									)}
								</>
							) : tagLoading ? (
								<LoaderBorder2 />
							) : filter?.length ? (
								<>
									<Feed posts={filter} actag={allTags[activeTag - 1]} />
								</>
							) : (
								<div className="container py-4 display-5">...</div>
							)
						) : (
							<div className="container py-4 display-5">No post as of now...</div>
						)}
					</div>
					<div className="container grid-2"></div>
				</>
			)}
		</main>
	)
}

export default Home
