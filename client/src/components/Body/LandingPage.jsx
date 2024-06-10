import { SignupModal } from '../Layout/Utils/AuthModal'

const LandingPage = () => {
	return (
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
	)
}
export default LandingPage
