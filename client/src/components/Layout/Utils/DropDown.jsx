import { Link } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../Context/UserContext'
import DefaultPfp from '../../../../public/logos/Default_pfp.svg'

const DropDown = ({ photo, email, username }) => {
	const { setUser } = useContext(UserContext)
	const [src, setSrc] = useState(photo)

	useEffect(() => {
		setSrc(photo)
	}, [photo])

	const logout = async () => {
		const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, { credentials: 'include' })
		const data = await response.json()
		setUser({ error: 'unauthorized', loggedIn: false })
		console.log(data)
	}

	return (
		<div className="dropdown d-flex">
			<button className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
				<img
					src={src}
					alt=""
					className="drp-pfp"
					onError={() => {
						setSrc(DefaultPfp)
					}}
				/>
			</button>
			<ul className="dropdown-menu px-3 py-4">
				<li className="d-flex align-items-center pb-2 gap-3">
					<div className="profile-pic" style={{ width: '2rem', height: '2rem' }}>
						<Link to={`/@${email.split('@')[0]}`}>
							<img src={src} alt="" />
						</Link>
					</div>
					<div>
						<p to={''} className=" fw-semibold  ">
							{username}
						</p>
						<p className=" text-secondary disabled">{email}</p>
					</div>
				</li>
				<li>
					<Link className="dropdown-item fw-semibold " to={`/@${email.split('@')[0]}`}>
						<i className="uil uil-graph-bar"></i> Profile
					</Link>
				</li>
				<li>
					<Link className="dropdown-item fw-semibold " to={'/blogs'}>
						<i className="uil uil-layers"></i> My Blogs
					</Link>
				</li>
				<li>
					<Link className="dropdown-item fw-semibold" to={'/bookmarks'}>
						<i className="uil uil-bookmark"></i> Bookmarks
					</Link>
				</li>
				<li>
					<Link className="dropdown-item text-danger fw-semibold" onClick={logout} to={'/'}>
						<i className="uil uil-signout"></i> Sign out
					</Link>
				</li>
			</ul>
		</div>
	)
}
export default DropDown
