import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
	<Router>
		<Routes>
			<Route path="/*" element={<App />}></Route>
		</Routes>
	</Router>
)
