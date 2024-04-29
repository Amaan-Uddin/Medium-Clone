import { useEffect, useContext } from 'react'
import NewBlog from './NewBlog'
import { Navigate, useLocation } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'

const EditBlog = () => {
	const location = useLocation()
	const { user } = useContext(UserContext)

	const canEdit = location.state?.edit || false
	const blogData = location.state?.BlogData

	useEffect(() => {
		console.log(canEdit)
		console.log(blogData)
	}, [blogData, canEdit])

	return (
		<>
			{blogData?.userId === user._id ? (
				<NewBlog blogData={blogData} canEdit={canEdit} />
			) : (
				<Navigate to={'/'} replace state={{ from: location }} />
			)}
		</>
	)
}
export default EditBlog
