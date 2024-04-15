import Header from './Head/Header'
// import Footer from './Footer/Footer'
import { Outlet } from 'react-router-dom'

const Layout = ({ logo }) => {
	return (
		<>
			<Header logo={logo} />
			<div className="layout">
				<Outlet />
			</div>
		</>
	)
}
export default Layout
