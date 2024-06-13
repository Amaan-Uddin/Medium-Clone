import { SignupModal } from '../Layout/Utils/AuthModal'

const LandingPage = () => {
	const fullLogo = '/logos/full.png'
	return (
		<>
			<header style={{ backgroundColor: '#ffc017' }}>
				<nav className="d-flex justify-content-between align-items-center px-3">
					<div id="searchbox " className="d-flex align-items-center gap-1">
						<div className="logo">
							<img src={fullLogo} alt="logo" />
						</div>
					</div>
					<div className="mx-4">
						<ul className="d-flex gap-4">
							<li>
								<button
									style={{ color: 'black' }}
									className="btn border-0"
									data-bs-toggle="modal"
									data-bs-target="#signupModal"
								>
									Sign up <i className="uil uil-signin"></i>
								</button>
							</li>
						</ul>
					</div>
				</nav>
			</header>
			<main className="d-flex align-items-start justify-content-center flex-column landing-page ">
				<div className="container ">
					<h1 className="landing-h1 mb-3">Fuel your curiosity.</h1>
					<h4 className="landing-h4">Venture into a world of stories, ideas, and expertise.</h4>
					<button
						className="btn btn-dark rounded-0 px-5 mt-5"
						style={{ backgroundColor: 'black', fontSize: '1.2rem' }}
						data-bs-toggle="modal"
						data-bs-target="#signupModal"
					>
						Explore
					</button>
					<SignupModal />
				</div>
			</main>
		</>
	)
}
export default LandingPage
