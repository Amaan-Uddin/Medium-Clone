import GoolgeLogo from '../../../../public/logos/Google__G.svg'
import EmailLogo from '../../../../public/logos/Email_E.svg'

const SignupModal = () => {
	const googleAuth = async (e) => {
		e.preventDefault()
		window.history.replaceState(null, '', window.location.origin)
		window.location.replace(`${import.meta.env.VITE_SERVER_URL}/auth/google`)
	}
	return (
		<div className="modal-dialog modal-dialog-centered">
			<div
				className="modal fade"
				id="signupModal"
				tabIndex="-1"
				aria-labelledby="signupModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header border-0">
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body d-flex flex-column align-items-center justify-content-center">
							<h4 className="auth-title">Join Medium.</h4>
							<div className="d-flex flex-column gap-5 py-5">
								<div className="d-flex flex-column align-items-center justify-content-center gap-3">
									<button
										onClick={googleAuth}
										className="bg-white d-flex justify-content-between gap-3 px-4 py-2 border border-1 rounded-5 auth-link"
									>
										<img src={GoolgeLogo} alt="" className="svg-logo" />
										Sign up with Google
										<div className="svg-block"></div>
									</button>

									<button className="bg-white d-flex justify-content-between gap-3 px-4 py-2 border border-1 rounded-5 auth-link">
										<img src={EmailLogo} alt="" className="svg-logo" /> Sign up with Email{' '}
										<div className="svg-block"></div>
									</button>
								</div>

								<div className="d-flex align-items-center p-0">
									Already have an account?{' '}
									<button
										className="btn border-0 text-primary"
										data-bs-toggle="modal"
										data-bs-target="#signinModal"
									>
										Sign in
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export { SignupModal }
