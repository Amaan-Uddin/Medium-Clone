import Feed from '../Posts/Feed'
const Home = ({ articles }) => {
	return (
		<main className="container">{articles.length ? <Feed articles={articles} /> : `No article as of now...`}</main>
	)
}
export default Home
