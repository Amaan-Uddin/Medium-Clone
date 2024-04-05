import { Link } from 'react-router-dom'

const Header = ({ search, setSearch }) => {
	return (
		<header className="px-3 border-bottom">
			<nav className="d-flex justify-content-between align-items-center">
				<div id="searchbox " className="d-flex align-items-center gap-1">
					<div className="logo">
						<img
							src="LOGO/Logo/01_Black/Symbol/PNG/RGB/Medium-Symbol-Black-RGB@1x.png"
							alt="show logo"
						></img>
					</div>
					<form
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
					</form>
				</div>
				<div className="mx-4">
					<ul className="d-flex gap-4">
						<li>
							<Link to={'/login'}>Login</Link>
						</li>
						<li>
							<Link to={'/signup'}>Sign-up</Link>
						</li>
					</ul>
				</div>
			</nav>
		</header>
	)
}
export default Header
