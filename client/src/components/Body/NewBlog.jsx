import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useContext, useState } from 'react'
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

const NewBlog = () => {
	const { user } = useContext(UserContext)
	const [btnClicked, setBtnClicked] = useState(false)
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [content, setContent] = useState('')
	const [file, setFile] = useState('')

	async function createNewBlog(e) {
		e.preventDefault()
		setBtnClicked(true)
		const formData = new FormData()
		formData.set('title', title)
		formData.set('description', description)
		formData.set('content', content)
		formData.set('file', file[0])
		formData.set('userId', user._id)
		try {
			const response = await fetch('http://localhost:5000/new', {
				method: 'POST',
				body: formData,
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
						<input
							type="file"
							id="file"
							className="new-blog-inputs"
							onChange={(e) => {
								setFile(e.target.files)
							}}
						></input>
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
