export function Loader() {
	return (
		<div className="loading-box">
			<div className="spinner-grow" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	)
}

export function LoaderBorder() {
	return (
		<div className="spinner-border" role="status" style={{ scale: '.7' }}>
			<span className="visually-hidden">Loading...</span>
		</div>
	)
}
export function LoaderBorder2() {
	return (
		<div className="loading-box">
			<div className="spinner-border" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	)
}
