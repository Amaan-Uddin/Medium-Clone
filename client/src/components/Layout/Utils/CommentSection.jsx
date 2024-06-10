import Comment from './Comment'
const CommentSection = ({ comments, author, setAllComments, setIsReply, textareaRef }) => {
	return (
		<div className="">
			<h2 className=" fw-semibold fs-3 sub heading">Comments</h2>
			<div className="d-flex align-items-center w-100 justify-content-center flex-column">
				{comments.map((comment) => (
					<Comment
						key={comment._id}
						comment={comment}
						author={author}
						setAllComments={setAllComments}
						setIsReply={setIsReply}
						textareaRef={textareaRef}
					/>
				))}
			</div>
		</div>
	)
}
export default CommentSection
