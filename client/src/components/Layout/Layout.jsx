import Header from './Head/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
	return (
		<>
			<Header />
			<div className="layout">
				<Outlet />
			</div>
		</>
	)
}
export default Layout
