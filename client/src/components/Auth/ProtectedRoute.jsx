import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { useContext } from 'react'

const ProtectedRoute = () => {
	const location = useLocation()
	const { user } = useContext(UserContext)
	console.log(user)
	return user?.loggedIn ? <Outlet /> : <Navigate to={'/login'} state={{ from: location }} replace />
}
export default ProtectedRoute
