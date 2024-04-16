import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../Context/UserContext'

const DropDown = ({ photo, email }) => {
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
			<ul className="dropdown-menu">
				<li>
					<Link className="dropdown-item fw-semibold" to={'/u/my-blogs'}>
						My Blogs
					</Link>
				</li>
				<li>
					<Link className="dropdown-item fw-semibold disabled" to={'/'}>
						{email}
					</Link>
				</li>
				<li>
					<Link className="dropdown-item text-danger fw-semibold" onClick={logout}>
						Logout
					</Link>
				</li>
			</ul>
		</div>
	)
}
export default DropDown
