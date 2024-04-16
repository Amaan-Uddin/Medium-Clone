import Post from './Post'
const Feed = ({ posts }) => {
	return (
		<>
			{posts.map((post) => (
				<Post key={post._id} post={post} />
			))}
		</>
	)
}
export default Feed
