import { Link } from 'react-router-dom'
const Article = ({ article }) => {
	return (
		<article className="d-flex gap-4 py-5 border-bottom">
			<div className="blog-image">
				<img src="images/blog-img.jpg" alt="show img" />
			</div>
			<div className="d-flex flex-column align-items-start">
				<Link to={'/'}>
					<div className="d-flex gap-2 align-items-center">
						<p className="author">{article.author}</p>
						<p className="datetime">{article.datetime}</p>
					</div>
					<h3 className="blog-title">{article.title}</h3>
				</Link>
				<p className="text">{article.description}</p>
				<p className="text">{article.body.length <= 50 ? article.body : `${article.body.slice(0, 50)}...`}</p>
				<div className="d-flex gap-2 tags justify-self-end">
					{article.tags.map((tag) => (
						<button key={tag} className="btn tag px-3 py-2">
							{tag}
						</button>
					))}
				</div>
			</div>
		</article>
	)
}
export default Article
