import { Link } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../Context/UserContext'
import DropDown from '../Utils/DropDown'

const Header = ({ search, setSearch, logo }) => {
	const { user, setUser } = useContext(UserContext)

	useEffect(() => {
		const fetchUser = async () => {
			const response = await fetch('http://localhost:5000/user', { credentials: 'include' })
			const data = await response.json()
			console.log(data)
			setUser(data)
		}
		fetchUser()
	}, [setUser])

	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(user))
	}, [user])

	return (
		<header className="px-3 border-bottom">
			<nav className="d-flex justify-content-between align-items-center">
				<div id="searchbox " className="d-flex align-items-center gap-1">
					<div className="logo">
						<img src={logo} alt="logo" />
					</div>
					{/* <form
						onSubmit={(e) => {
							e.preventDefault()
						}}
					>
						<input
							type="text"
							name="search"
							id="search"
							className="form-control px-4 py-2"
							placeholder="Search"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value)
							}}
						/>
					</form> */}
				</div>
				<div className="mx-4">
					<ul className="d-flex gap-4">
						{user?.loggedIn === true ? (
							<>
								<li className="d-flex align-items-center">
									<Link to={'/u/new-blog'}>Write</Link>
								</li>
								<li className="profile-pic">
									<DropDown photo={user.photos[0]} email={user.email} />
								</li>
							</>
						) : (
							<>
								<li>
									<Link to={'/login'}>Login</Link>
								</li>
								<li>
									<Link to={'/signup'}>Sign-up</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</nav>
		</header>
	)
}
export default Header
