import Feed from '../Posts/Feed'
const Home = ({ posts }) => {
	return <main className="container">{posts.length ? <Feed posts={posts} /> : `No post as of now...`}</main>
}
export default Home
