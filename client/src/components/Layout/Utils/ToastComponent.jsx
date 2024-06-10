import { useRef, useEffect, useContext } from 'react'
import { ToastContext } from '../../Context/ToastContext'

const ToastComponent = () => {
	const toastRef = useRef(null)
	const { toast, hideToast } = useContext(ToastContext)

	useEffect(() => {
		if (toast.show) {
			const toastElement = toastRef.current
			const toast = new window.bootstrap.Toast(toastElement)
			toast.show()
			toastElement.addEventListener('hidden.bs.toast', hideToast)
			return () => {
				toastElement.removeEventListener('hidden.bs.toast', hideToast)
			}
		}
	}, [toast, hideToast])

	return (
		<div className="toast-container position-fixed bottom-0 end-0 p-3 ">
			<div ref={toastRef} className="toast " role="alert" aria-live="assertive" aria-atomic="true">
				<div className="toast-header bg-white">
					<strong className="me-auto">Medium</strong>
					<small>Just now</small>
					<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
				</div>
				<div className="toast-body bg-white rounded-1 fw-semibold">{toast.message}</div>
			</div>
		</div>
	)
}

export default ToastComponent
