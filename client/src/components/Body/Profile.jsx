import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../Context/UserContext'
import About from './About'
import DefaultPfp from '../../../public/logos/Default_pfp.svg'
import Feed from '../Posts/Feed'
import { useParams, Link } from 'react-router-dom'
import { ToastContext } from '../Context/ToastContext'

const Dashboard = () => {
	const { user } = useContext(UserContext)
	const { showToast } = useContext(ToastContext)

	const { username } = useParams()
	const [profile, setProfile] = useState()
	const [src, setSrc] = useState()

	const [activeTag, setActiveTag] = useState()
	const [myPost, setMyPost] = useState()

	function getContent(index) {
		setActiveTag(index)
	}

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/profile`, {
					credentials: 'include',
					method: 'POST',
					body: JSON.stringify({ username: username }),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('failed to fetch profile')
				const data = await response.json()
				setProfile(data)
				setSrc(data.userId.photos[0])
				setActiveTag(0)
			} catch (error) {
				console.error(error)
			}
		}
		fetchProfile()
	}, [username])

	useEffect(() => {
		const fetchMyPosts = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/myblogs`, {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({
						userId: profile.userId._id,
					}),
					headers: {
						'Content-type': 'application/json',
					},
				})
				if (!response.ok) throw new Error('Something went wrong. Failed to fetch data from the server')
				const data = await response.json()
				setMyPost(data)
			} catch (error) {
				showToast(error.message)
			}
		}
		if (profile) fetchMyPosts()
	}, [profile])

	return (
		<main className="container">
			{profile && (
				<div className="grid-1">
					<div className="d-flex align-items-center gap-4 profile mt-5 py-3">
						<div className="dashboard profile-pic">
							<img
								src={src}
								alt=""
								className="drp-pfp"
								onError={() => {
									setSrc(DefaultPfp)
								}}
							/>
						</div>
						<div className="profile-desc">
							<p className="fw-bolder dash-name">{profile.userId.displayName}</p>
							<p className="text-secondary disabled dash-email">{profile.userId.email}</p>
							<p className="text-secondary  disabled  dash-desc pt-1">{profile.description}</p>
							{profile.userId.email === user.email ? (
								<>
									<Link to={`/edit/profile/${username}`} state={{ profile: profile }}>
										<button className="btn text-success profile-edit fw-semibold pt-2">
											Edit profile
										</button>
									</Link>
								</>
							) : (
								<></>
							)}
						</div>
					</div>
					<div className="all-tags container d-flex mt-3 w-100 overflow-x-auto ">
						{Array('Home', 'About').map((btn, index) => (
							<button
								key={index}
								id={btn}
								className={`px-4 py-3 all-tags-btn ${activeTag === index ? 'focus' : ''} `}
								onClick={() => {
									getContent(index)
								}}
							>
								{btn}
							</button>
						))}
					</div>
					{!activeTag ? myPost && <Feed posts={myPost} /> : <About about={profile.about} />}
				</div>
			)}
		</main>
	)
}
export default Dashboard
