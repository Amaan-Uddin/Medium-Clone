const Login = () => {
	const googleAuth = async (e) => {
		e.preventDefault()
		window.open('http://localhost:5000/auth/google', '_self')
	}

	return (
		<main className="login-main">
			<section className="container box d-flex flex-column align-items-center">
				<h1 className="auth-title">
					<img src="LOGO/Logo/01_Black/Full/PNG/CMYK/Medium-Logo-Black-CMYK@1x.png" alt="show logo" />
				</h1>
				<div className="container d-flex flex-column align-items-center">
					<div className="auth-box d-flex flex-column border border-1 py-4 px-5 rounded-3">
						<h3>Login</h3>
						<form className="form-group d-flex flex-column gap-3">
							<input
								type="text"
								name="email"
								id="email"
								placeholder="Email"
								className="form-control w-100"
								required
							/>
							<div className="d-flex flex-column">
								<input
									type="password"
									name="password"
									id="password"
									placeholder="Password"
									className="form-control"
									required
								/>
								<button id="show-pass" className="bg-transparent border-0 text-primary align-self-end">
									show password
								</button>
							</div>
							<button className="btn btn-primary w-100 rounded-5">Submit</button>
						</form>
						<span className="text-center my-2 text-secondary">or</span>
						<button onClick={googleAuth} className="btn btn-success rounded-5 w-100">
							Login with Google
						</button>
					</div>
				</div>
			</section>
		</main>
	)
}
export default Login
