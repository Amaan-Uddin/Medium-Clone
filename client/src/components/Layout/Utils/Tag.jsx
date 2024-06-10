const Tag = ({ index, tag, tags, setTags }) => {
	function removeTag(e) {
		e.preventDefault()
		const newTags = tags.filter((tags) => tags !== tag)
		setTags(newTags)
	}
	return (
		<li key={index} className="tag-cls">
			<p>{tag}</p>
			<button
				aria-label="Close"
				className="btn-close tag-btn"
				style={{ scale: '.6' }}
				onClick={removeTag}
			></button>
		</li>
	)
}
export default Tag
