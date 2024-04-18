import Feed from '../Posts/Feed'
import { Loader } from '../Layout/Utils/Loaders'
const Home = ({ posts }) => {
	return <main className="container">{posts?.length ? <Feed posts={posts} /> : <Loader />}</main>
}
export default Home
