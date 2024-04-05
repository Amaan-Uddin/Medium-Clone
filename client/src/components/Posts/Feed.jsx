import Article from './Article'
const Feed = ({ articles }) => {
	return (
		<>
			{articles.map((article) => (
				<Article key={article.id} article={article} />
			))}
		</>
	)
}
export default Feed
