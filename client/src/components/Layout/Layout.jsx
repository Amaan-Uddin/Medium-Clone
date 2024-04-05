import Header from './Head/Header'
// import Footer from './Footer/Footer'
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
