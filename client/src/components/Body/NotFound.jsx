import { Link } from 'react-router-dom'

const NotFound = () => {
	return (
		<main className="container not-found">
			<div className="grid-1">
				<p className="fw-normal not-found-p">Page not found</p>
				<h1 className="not-found-h1">404</h1>
				<p className="not-found-p2">Out of nothing, something.</p>
				<div className="not-found-div">
					<p>
						You can find &#40; just about&#41; anything on Medium — apparently even a page that doesn&apos;t
						exist. Maybe these stories about finding what you didn&apos;t know you were looking for will
						take you somewhere new?
					</p>
					<p>
						<Link to={'/home'} className="text-black text-decoration-underline">
							home
						</Link>
					</p>
				</div>
			</div>
		</main>
	)
}
export default NotFound
