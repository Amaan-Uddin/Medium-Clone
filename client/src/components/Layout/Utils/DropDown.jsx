import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../Context/UserContext'

const DropDown = ({ photo, email, username }) => {
	const { setUser } = useContext(UserContext)

	const logout = async () => {
		const response = await fetch('http://localhost:5000/logout', { credentials: 'include' })
		const data = await response.json()
		setUser({ error: 'unauthorized', loggedIn: false })
		console.log(data)
	}

	return (
		<div className="dropdown d-flex">
			<button className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
				<img src={photo} alt="show profile" />
			</button>
			<ul className="dropdown-menu px-3 py-4">
				<li className="d-flex align-items-center pb-2 gap-3">
					<div className="profile-pic" style={{ width: '2rem', height: '2rem' }}>
						<Link>
							<img src={photo} alt="" />
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
					<Link className="dropdown-item fw-semibold " to={'/u/blogs'}>
						<i className="uil uil-layers"></i> My Blogs
					</Link>
				</li>
				<li>
					<Link className="dropdown-item fw-semibold" to={'/u/bookmarks'}>
						<i className="uil uil-bookmark"></i> Bookmarks
					</Link>
				</li>
				<li>
					<Link className="dropdown-item text-danger fw-semibold" onClick={logout} to={'/'}>
						<i className="uil uil-signout"></i> Logout
					</Link>
				</li>
			</ul>
		</div>
	)
}
export default DropDown
