const Modal = ({ deletePost }) => {
	return (
		<div
			className="modal fade"
			id="exampleModal"
			tabIndex="-1"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="exampleModalLabel">
							Delete Blog Post
						</h1>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div className="modal-body">
						Are you sure you want to delete this blog post?
						<br />
						This action cannot be undone. Deleting this post will permanently remove it from your blog.
						Please confirm your decision to proceed with the deletion.
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
							Close
						</button>
						<button type="button" className="btn btn-danger" onClick={deletePost}>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Modal
