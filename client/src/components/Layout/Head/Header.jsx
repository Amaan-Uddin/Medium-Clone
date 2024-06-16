import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState, useRef } from 'react'
import { UserContext } from '../../Context/UserContext'
import DropDown from '../Utils/DropDown'
import { ToastContext } from '../../Context/ToastContext'

const Header = () => {
	const fullLogo = '/logos/full.png'

	const { user, setUser } = useContext(UserContext)
	const { showToast } = useContext(ToastContext)
	const location = useLocation()
	const navigate = useNavigate()
	const searchBox = useRef()
	const [search, setSearch] = useState('')
	const [searchResult, setSearchResult] = useState({ blogPosts: null, blogTags: null, profiles: null })

	async function performSearch() {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/search`, {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ searchTerm: search }),
				headers: { 'Content-Type': 'application/json' },
			})
			if (!response.ok) throw new Error('Something went wrong.')
			const data = await response.json()
			setSearchResult(data)
		} catch (error) {
			showToast(error.message)
		}
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/user`, {
					method: 'GET',
					credentials: 'include',
				})
				if (!response.ok) throw new Error('Something went wrong, server failed to fetch user.')
				const data = await response.json()
				console.log(data)
				setUser(data)
			} catch (error) {
				showToast(error.message)
			}
		}
		fetchUser()
	}, [setUser])

	function handleFocus() {
		if (search.length) searchBox.current.style.display = 'block'
	}
	function handleBlur(e) {
		if (searchBox.current && !searchBox.current.contains(e.relatedTarget)) {
			searchBox.current.style.display = 'none'
		}
	}

	useEffect(() => {
		if (searchBox?.current) searchBox.current.style.display = 'none'
	}, [location])

	return (
		<>
			{user.loggedIn && (
				<header className="border-bottom">
					<nav className="d-flex justify-content-between align-items-center px-3">
						<div id="searchbox " className="d-flex align-items-center gap-1">
							<Link to={user.loggedIn ? '/home' : '/'}>
								<div className="logo">
									<img src={fullLogo} alt="logo" />
								</div>
							</Link>
							<div className="position-relative">
								<input
									type="text"
									name="search"
									id="search"
									placeholder="search"
									className="px-3 form-control search-bar"
									autoComplete="off"
									value={search}
									onFocus={() => {
										handleFocus()
									}}
									onBlur={handleBlur}
									onChange={(e) => {
										setSearch(e.target.value)
									}}
									onKeyUp={(e) => {
										if (search.length > 1 && e.code === 'Enter') {
											navigate(`/search?q=${search}`)
										}
										if (search.length) {
											handleFocus()
											performSearch()
										}
										if (!search.length) {
											searchBox.current.style.display = 'none'
											setSearchResult([])
										}
									}}
								/>
								<div ref={searchBox} className="search-box bg-white">
									<div>
										<ul className="d-flex flex-column overflow-x-auto align-items-start justify-content-center search-list">
											{searchResult.blogPosts && searchResult.blogPosts.length > 0 && (
												<>
													<p className="fw-semibold">Blogs</p>
													{searchResult.blogPosts.map((post) => (
														<li className="d-flex gap-2 align-items-center" key={post._id}>
															<span
																style={{ fontSize: '1rem', fontWeight: '700' }}
																className="text-primary"
															>
																{`M:`}
															</span>
															<Link
																className="search-result"
																to={`/read-blog/${post.slug}-${post.uid}`}
															>
																{post.title}
															</Link>
														</li>
														// eslint-disable-next-line no-mixed-spaces-and-tabs
													))}
												</>
											)}
										</ul>
									</div>
									<div>
										<ul className="d-flex flex-column overflow-x-auto align-items-start justify-content-center search-list mb-2">
											{searchResult.profiles && searchResult.profiles.length > 0 && (
												<>
													<p className="fw-semibold">People</p>
													{searchResult.profiles.map((profile) => (
														<li
															className="d-flex gap-2 align-items-center pt-1"
															key={profile._id}
														>
															<span
																style={{ fontSize: '1.2rem', fontWeight: '700' }}
																className="text-info"
															>
																@
															</span>
															<Link
																className="search-result tags bg-white border border-1 rounded-5 py-1 px-3"
																to={`/${profile.username}`}
															>
																{profile.username.split('@')[1]}
															</Link>
														</li>
														// eslint-disable-next-line no-mixed-spaces-and-tabs
													))}
												</>
											)}
										</ul>
									</div>
									<div>
										<ul className="d-flex flex-column overflow-x-auto align-items-start justify-content-center search-list">
											{searchResult.blogTags && searchResult.blogTags.length > 0 && (
												<>
													<p className="fw-semibold">Tags</p>
													{searchResult.blogTags.map((tag) => (
														<li
															className="d-flex gap-2 align-items-center pt-1"
															key={tag._id}
														>
															<span
																style={{ fontSize: '1.3rem', fontWeight: '700' }}
																className="text-warning"
															>
																#
															</span>
															<Link
																className="search-result tags bg-white border border-1 rounded-5 py-1 px-3"
																to={`/search/tag?q=${tag.tag}`}
															>
																{tag.tag}
															</Link>
														</li>
														// eslint-disable-next-line no-mixed-spaces-and-tabs
													))}
												</>
											)}
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="mx-4">
							<ul className="d-flex gap-4">
								<li className="d-flex align-items-center">
									<Link to={'/new'} style={{ color: 'black', textWrap: 'nowrap' }}>
										Write <i className="uil uil-pen"></i>
									</Link>
								</li>
								<li className="profile-pic">
									<DropDown photo={user.photos[0]} email={user.email} username={user.displayName} />
								</li>
							</ul>
						</div>
					</nav>
				</header>
			)}
		</>
	)
}
export default Header
