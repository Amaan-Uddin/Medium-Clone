import { useState } from 'react'
import Tag from './Tag'

const TagInputs = ({ tags, setTags }) => {
	let [tag, setTag] = useState('')

	function enterTag(e) {
		if (tag && (e.keyCode == 13 || e.keyCode == 188 || e.keyCode == 110)) {
			tag = tag.replace(/[,.!%$#*^)(_+\-/\\|`~]/g, '')
			if (tag.length >= 3) {
				if (!tags.includes(tag)) {
					setTags([...tags, tag])
					setTag('')
				}
			}
		}
	}

	return (
		<div className="container my-3" style={{ paddingLeft: '0px' }}>
			<div className="tag-box px-2 py-2">
				<ul className="tag-list d-flex gap-2 align-items-center">
					{tags && tags.map((tag, index) => <Tag key={index} tag={tag} tags={tags} setTags={setTags} />)}
				</ul>
			</div>
			<input
				type="text"
				name="tag-input"
				id="tag-input"
				placeholder="Tags"
				className="new-blog-inputs mt-3 "
				style={{ width: '50%' }}
				autoComplete="off"
				value={tag}
				onChange={(e) => {
					setTag(e.target.value)
				}}
				onKeyUp={enterTag}
			/>
		</div>
	)
}
export default TagInputs
