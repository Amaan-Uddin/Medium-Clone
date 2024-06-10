import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import DefaultPfp from '../../../public/logos/Default_pfp.svg'
import { LoaderBorder } from '../Layout/Utils/Loaders'
import { UserContext } from '../Context/UserContext'
import { ToastContext } from '../Context/ToastContext'

const modules = {
	toolbar: [['bold', 'italic', 'underline', 'strike', 'blockquote'], ['link'], ['clean']],
}

const formats = ['bold', 'italic', 'underline', 'strike', 'blockquote', 'link']

const EditProfile = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { showToast } = useContext(ToastContext)

	const { setUser } = useContext(UserContext)

	const [btnClicked, setBtnClicked] = useState(false)

	const profile = location.state?.profile || false
	const [src, setSrc] = useState()

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [description, setDescription] = useState('')
	const [about, setAbout] = useState('')

	const [firstNameValid, setFirstNameValid] = useState(false)
	const [lastNameValid, setLastNameValid] = useState(false)
	const [formSubmited, setFormSubmited] = useState(false)

	async function saveProfile(e) {
		e.preventDefault()
		setBtnClicked(true)
		setFormSubmited(true)

		const firstNameValid = firstName.trim().length > 0
		const lastNameValid = lastName.trim().length > 0

		setFirstNameValid(firstNameValid)
		setLastNameValid(lastNameValid)

		if (!(firstNameValid && lastNameValid)) {
			return setBtnClicked(false)
		}
		const formData = new FormData()
		formData.set('userId', profile.userId._id)
		formData.set('profileId', profile._id)
		formData.set('firstName', firstName)
		formData.set('lastName', lastName)
		formData.set('description', description)
		formData.set('about', about)
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/update-profile`, {
				credentials: 'include',
				method: 'POST',
				body: new URLSearchParams(formData).toString(),
				headers: {
					'Content-type': 'application/x-www-form-urlencoded',
				},
			})
			if (!response.ok) {
				setBtnClicked(false)
				throw Error('Failed to update profile.')
			}
			const data = await response.json()
			setUser(data.user)
			setTimeout(() => {
				showToast('Successfully updated profile.')
				navigate(`/${profile.username}`)
			}, 2000)
		} catch (error) {
			showToast(error.message)
		}
	}

	useEffect(() => {
		if (profile) {
			setSrc(profile.userId.photos[0] || '')
			setFirstName(profile.userId.firstName || '')
			setLastName(profile.userId.lastName || '')
			setDescription(profile.description || '')
			setAbout(profile.about || '')
		} else {
			navigate('/home', { replace: location })
		}
	}, [profile, navigate, location])

	return (
		<main className="container">
			{profile && (
				<div>
					<div className="d-flex align-items-center gap-4 profile mt-5 py-3">
						<div className="dashboard profile-pic">
							<img
								src={src}
								alt=""
								className="drp-pfp"
								onError={() => {
									setSrc(DefaultPfp)
								}}
							/>
						</div>
						<div className="profile-desc">
							<p className="fw-bolder dash-name">
								{firstName} {lastName}
							</p>
							<p className="text-secondary disabled dash-email">{profile.userId.email}</p>
							<p className="text-secondary  disabled  dash-desc pt-1">{description}</p>
						</div>
					</div>
					<div className="container d-flex my-5 w-100">
						<form className="d-flex flex-column  new-blog-form gap-3 needs-validation" noValidate>
							<div className="d-flex gap-3 align-items-center">
								<div className="w-100">
									<input
										type="text"
										name="firstname"
										id="firstname"
										placeholder="First name"
										className={`new-blog-inputs ${
											formSubmited ? (firstNameValid ? 'is-valid' : 'is-invalid') : ''
										}`}
										autoComplete="off"
										required
										value={firstName}
										onChange={(e) => {
											setFirstName(e.target.value)
										}}
									/>
									<div className="valid-feedback">Looks good!</div>
									<div className="invalid-feedback">First name is required.</div>
								</div>
								<div className="w-100">
									<input
										type="text"
										name="lastname"
										id="lastname"
										placeholder="Last name"
										className={`new-blog-inputs  ${
											formSubmited ? (lastNameValid ? 'is-valid' : 'is-invalid') : ''
										}`}
										autoComplete="off"
										required
										value={lastName}
										onChange={(e) => {
											setLastName(e.target.value)
										}}
									/>
									<div className="valid-feedback">Looks good!</div>
									<div className="invalid-feedback">Last name is required.</div>
								</div>
							</div>
							<input
								type="text"
								name="description"
								id="description"
								placeholder="Description"
								className="new-blog-inputs"
								autoComplete="off"
								required
								value={description}
								onChange={(e) => {
									setDescription(e.target.value)
								}}
							/>
							<div className="quill-box mt-2">
								<ReactQuill
									placeholder="About"
									theme="bubble"
									className="w-100"
									modules={modules}
									formats={formats}
									value={about}
									onChange={(newVal) => {
										setAbout(newVal)
									}}
								/>
							</div>
							<button
								className="btn bg-black text-white py-2"
								type="submit"
								style={{ fontWeight: '600' }}
								onClick={saveProfile}
							>
								{btnClicked ? <LoaderBorder /> : 'Save'}
							</button>
						</form>
					</div>
				</div>
			)}
		</main>
	)
}
export default EditProfile
