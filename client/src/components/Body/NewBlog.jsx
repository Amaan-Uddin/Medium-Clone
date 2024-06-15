import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { LoaderBorder } from '../Layout/Utils/Loaders'
import { previewImage } from '../../../public/scripts/utilities'
import TagInputs from '../Layout/Utils/TagInputs'
import { ToastContext } from '../Context/ToastContext'

const modules = {
	toolbar: [
		[{ header: 1 }, { header: 2 }, { header: [3, false] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
		['link'],
		['clean'],
		['code-block'],
	],
}

const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'code-block',
]

const NewBlog = ({ blogData, canEdit }) => {
	const { user } = useContext(UserContext)
	const navigate = useNavigate()
	const { showToast } = useContext(ToastContext)

	const [btnClicked, setBtnClicked] = useState(false)
	const [formSubmitted, setFormSubmitted] = useState(false)

	const getStoredData = (key) => {
		const storedData = localStorage.getItem('BlogData')
		if (storedData) {
			const parsedData = JSON.parse(storedData)
			return parsedData[key]
		}
	}
	const [title, setTitle] = useState(blogData ? blogData.title : getStoredData('title'))
	const [description, setDescription] = useState(blogData ? blogData.description : getStoredData('description'))
	const [content, setContent] = useState(blogData ? blogData.content : getStoredData('content'))
	const [tags, setTags] = useState(blogData ? blogData.tags : getStoredData('tags'))
	const [file, setFile] = useState('')

	const [titleValid, setTitleValid] = useState(false)
	const [descriptionValid, setDescriptionValid] = useState(false)
	const [contentValid, setContentValid] = useState(false)
	const [fileValid, setFileValid] = useState(false)

	useEffect(() => {
		if (!canEdit) {
			const oldData = localStorage.getItem('BlogData')
			let parsedData = JSON.parse(oldData)
			if (parsedData) {
				parsedData = { title, description, content, tags, file }
				localStorage.setItem('BlogData', JSON.stringify(parsedData))
			}
		}
	}, [canEdit, title, description, content, tags, file])

	async function createNewBlog(e) {
		e.preventDefault()
		setBtnClicked(true)
		setFormSubmitted(true)

		const getFile = file.length > 0
		const getTitle = title.trim().length > 0
		const getDescription = description.trim().length > 0
		const getContent = content === '<p><br></p>' || content === '' ? false : true

		setFileValid(getFile)
		setTitleValid(getTitle)
		setDescriptionValid(getDescription)
		setContentValid(getContent)

		if (!(getTitle && getDescription && getContent)) {
			return setBtnClicked(false)
		}

		const formData = new FormData()
		formData.set('title', title)
		formData.set('description', description)
		formData.set('content', content)
		formData.set('tags', JSON.stringify(tags))
		formData.set('userId', user._id)
		if (!canEdit && file?.length) formData.set('file', file[0])

		try {
			const id = blogData?.id
			const slug = blogData?.slug

			const url = canEdit ? `/edit?id=${id}&slug=${slug}` : '/new'
			const method = canEdit ? 'PUT' : 'POST'
			const body = canEdit ? new URLSearchParams(formData).toString() : formData
			const headers = canEdit ? { 'Content-type': 'application/x-www-form-urlencoded' } : {}
			// Do not set 'Content-type' : 'multipart/form-data' as you will be required to set boundary value as well

			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api${url}`, {
				method: method,
				credentials: 'include',
				body: body,
				headers: headers,
			})
			if (!response.ok) {
				setBtnClicked(false)
				throw Error('Failed to post blog to server')
			}
			const toastMsg = canEdit ? 'Edited' : 'Created'
			showToast(`Successfully ${toastMsg} post.`)
			navigate('/blogs', { replace: true })
		} catch (error) {
			showToast(error.message)
			console.error(error)
		}
	}

	return (
		<>
			<main className="new-blog d-flex flex-column align-items-center ">
				<section className=" container d-flex align-items-center justify-content-center py-4 flex-column">
					<form className="d-flex flex-column align-items-center new-blog-form gap-3">
						<div
							id="previewImage"
							className="d-flex align-self-start align-items-center justify-content-center"
						>
							{canEdit ? <img src={canEdit ? blogData?.file : ''} /> : 'Upload a cover for your blog'}
						</div>
						{!canEdit && (
							<div className="w-100">
								<input
									type="file"
									id="file"
									className={`new-blog-inputs ${
										formSubmitted ? (fileValid ? 'is-valid' : 'is-invalid') : ''
									}`}
									onChange={(e) => {
										previewImage(e, setFile)
									}}
								/>
								<div className="valid-feedback">Looks good!</div>
								<div className="invalid-feedback">Cover page is required.</div>
							</div>
						)}
						<div className="w-100">
							<input
								type="text"
								name="title"
								id="title"
								placeholder="Title"
								className={`new-blog-inputs ${
									formSubmitted ? (titleValid ? 'is-valid' : 'is-invalid') : ''
								}`}
								autoComplete="off"
								value={title}
								onChange={(e) => {
									setTitle(e.target.value)
								}}
							/>
							<div className="valid-feedback">Looks good!</div>
							<div className="invalid-feedback">Title is required.</div>
						</div>
						<div className="w-100">
							<input
								type="text"
								name="description"
								id="description"
								placeholder="Description"
								className={`new-blog-inputs ${
									formSubmitted ? (descriptionValid ? 'is-valid' : 'is-invalid') : ''
								}`}
								autoComplete="off"
								value={description}
								onChange={(e) => {
									setDescription(e.target.value)
								}}
							/>
							<div className="valid-feedback">Looks good!</div>
							<div className="invalid-feedback">Description is required.</div>
						</div>
						<div className="w-100">
							<div
								className={`quill-box ${
									formSubmitted ? (contentValid ? 'is-valid' : 'is-invalid') : ''
								}`}
							>
								<ReactQuill
									placeholder="Write your blog..."
									theme="bubble"
									className="w-100"
									modules={modules}
									formats={formats}
									value={content}
									onChange={(newVal) => {
										setContent(newVal)
									}}
								/>
							</div>
							<div className="valid-feedback">Looks good!</div>
							<div className="invalid-feedback">Blog Content is required.</div>
						</div>
					</form>
					<TagInputs tags={tags} setTags={setTags} />
					<button
						className="btn bg-black text-white rounded-1 w-100 py-2"
						type="submit"
						onClick={createNewBlog}
						style={{ fontWeight: '600' }}
					>
						{!btnClicked && <>{`Publish`}</>}
						{btnClicked && (
							<>
								<LoaderBorder />
							</>
						)}
					</button>
				</section>
			</main>
		</>
	)
}
export default NewBlog
