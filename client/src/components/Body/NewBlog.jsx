import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { LoaderBorder } from '../Layout/Utils/Loaders'
import hljs from 'highlight.js'

const modules = {
	syntax: {
		highlight: (text) => hljs.highlightAuto(text).value,
	},
	toolbar: [
		[{ header: [1, 2, false] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
		['link', 'image'],
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
	'image',
	'code-block',
]

const NewBlog = ({ blogData, canEdit }) => {
	const { user } = useContext(UserContext)
	const navigate = useNavigate()

	const [btnClicked, setBtnClicked] = useState(false)
	const [title, setTitle] = useState(() => {
		if (blogData) {
			return blogData.title
		}
		const title = localStorage.getItem('BlogData')
		return title ? JSON.parse(title).title : {}
	})
	const [description, setDescription] = useState(() => {
		if (blogData) {
			return blogData.description
		}
		const description = localStorage.getItem('BlogData')
		return description ? JSON.parse(description).description : {}
	})
	const [content, setContent] = useState(() => {
		if (blogData) {
			return blogData.content
		}
		const content = localStorage.getItem('BlogData')
		return content ? JSON.parse(content).content : {}
	})
	const [file, setFile] = useState('')

	useEffect(() => {
		if (!canEdit) {
			const oldData = localStorage.getItem('BlogData')
			let parsedData = JSON.parse(oldData)
			if (parsedData) {
				parsedData = { title, description, content, file }
				localStorage.setItem('BlogData', JSON.stringify(parsedData))
			}
		}
	}, [canEdit, title, description, content, file])

	function previewImage(e) {
		setFile(e.target.files)
		const image = e.target.files[0]
		if (image) {
			const reader = new FileReader()
			reader.onload = function (e) {
				const img = document.createElement('img')
				img.src = e.target.result
				document.getElementById('previewImage').innerHTML = '' // Clear previous image
				document.getElementById('previewImage').appendChild(img)
			}
			reader.readAsDataURL(image)
		}
	}

	async function createNewBlog(e) {
		e.preventDefault()
		setBtnClicked(true)
		const formData = new FormData()
		formData.set('title', title)
		formData.set('description', description)
		formData.set('content', content)
		formData.set('userId', user._id)
		if (!canEdit) formData.set('file', file[0])

		try {
			const queryParams = new URLSearchParams(location.search)
			const id = queryParams.get('id')
			const post = queryParams.get('post')

			const url = canEdit ? `http://localhost:5000/edit?id=${id}&post=${post}` : 'http://localhost:5000/new'
			const method = canEdit ? 'PUT' : 'POST'
			const body = canEdit ? new URLSearchParams(formData).toString() : formData
			const headers = canEdit ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {} // set no 'Content-type' : 'multipart/form-data' since we will have to set boundary

			const response = await fetch(url, {
				credentials: 'include',
				method: method,
				body: body,
				headers: headers,
			})
			if (!response.ok) {
				setBtnClicked(false)
				throw Error('Error:Failed to post blog to server')
			}
			navigate('/u/my-blogs', { replace: true })
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<main className="new-blog d-flex flex-column align-items-center ">
				<section className="container d-flex align-items-center justify-content-center py-4">
					<form
						onSubmit={createNewBlog}
						className="d-flex flex-column align-items-center new-blog-form gap-3"
					>
						<div
							id="previewImage"
							className="d-flex align-self-start align-items-center justify-content-center"
						>
							{canEdit ? (
								<img src={canEdit ? blogData?.file : ''} />
							) : (
								'Upload a cover page for your blog'
							)}
						</div>
						{!canEdit && (
							<input type="file" id="file" className="new-blog-inputs " onChange={previewImage}></input>
						)}
						<input
							type="text"
							name="title"
							id="title"
							placeholder="Title"
							className="new-blog-inputs"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value)
							}}
						></input>
						<input
							type="text"
							name="description"
							id="description"
							placeholder="Description or Subtitle...."
							className="new-blog-inputs"
							value={description}
							onChange={(e) => {
								setDescription(e.target.value)
							}}
						></input>
						<div className="quill-box">
							<ReactQuill
								className="w-100"
								modules={modules}
								formats={formats}
								value={content}
								onChange={(newVal) => {
									setContent(newVal)
								}}
							/>
						</div>
						<button
							className="btn btn-success rounded-1 py-1 w-100 py-2"
							type="submit"
							style={{ backgroundColor: 'black', fontWeight: '600' }}
						>
							{!btnClicked && <>{`Publish`}</>}
							{btnClicked && (
								<>
									<LoaderBorder />
								</>
							)}
						</button>
					</form>
				</section>
			</main>
		</>
	)
}
export default NewBlog
