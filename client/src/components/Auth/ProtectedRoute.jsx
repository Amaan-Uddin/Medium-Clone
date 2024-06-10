import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { useContext } from 'react'

const ProtectedRoute = () => {
	const location = useLocation()
	const { user } = useContext(UserContext)
	return user?.loggedIn ? <Outlet /> : <Navigate to={'/'} state={{ from: location }} replace />
}
export default ProtectedRoute
