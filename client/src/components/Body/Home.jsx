import Feed from '../Posts/Feed'
import { Loader } from '../Layout/Utils/Loaders'
const Home = ({ posts }) => {
	return (
		<main className="d-flex gap-2 container position-relative">
			<div className="container grid-1">{posts?.length ? <Feed posts={posts} /> : <Loader />}</div>
			<div className="container grid-2">
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto ea maxime eaque fuga voluptatum
					culpa totam dolorem nemo ipsam quas, beatae quae veritatis ut ipsa iure hic excepturi voluptates ex
					unde dolor qui doloribus obcaecati expedita. Ipsam perferendis corporis vero blanditiis quo illo
					voluptates, distinctio suscipit cumque eligendi asperiores totam earum saepe, nihil neque fuga!
					Corporis, voluptatum, harum est nihil facilis modi eaque facere blanditiis cum quam tempora
					quibusdam, rerum praesentium non ut consequatur labore? Amet, veritatis, fugiat ex ad delectus
					consequatur quod dolorem inventore veniam eius facere accusamus saepe numquam earum odit dolores at
					itaque, id nesciunt. Delectus, suscipit. lorem1000
				</p>
			</div>
		</main>
	)
}
export default Home
