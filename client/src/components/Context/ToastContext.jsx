import { createContext, useState } from 'react'

export const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
	const [toast, setToast] = useState({ message: '', show: false })

	function showToast(message) {
		setToast({ message: message, show: true })
	}

	function hideToast() {
		setToast({ ...toast, show: false })
	}

	return <ToastContext.Provider value={{ toast, showToast, hideToast }}>{children}</ToastContext.Provider>
}
