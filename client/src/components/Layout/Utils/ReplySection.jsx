import Comment from './Comment'
const ReplySection = ({ comments, author, setAllComments, setIsReply, textareaRef }) => {
	return (
		<div>
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
export default ReplySection
