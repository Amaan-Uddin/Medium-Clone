import Post, { GridPost } from './Post'
const Feed = ({ posts, isGrid, actag }) => {
	return (
		<>
			{isGrid && posts.map((post) => <GridPost key={post._id} post={post} actag={actag} />)}
			{!isGrid && posts.map((post) => <Post key={post._id} post={post} actag={actag} />)}
		</>
	)
}
export default Feed
