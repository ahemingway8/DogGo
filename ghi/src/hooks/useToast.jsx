import { useState } from 'react'
import ToastComponent from '../components/toast'

const useToast = () => {
    const [toast, setToast] = useState(null)

    const showToast = (params) => {
        if (typeof params === 'string') {
            setToast({
                message: params,
                duration: 3000,
                showConfirm: false,
            })
        } else {
            setToast({
                message: params.message,
                duration: params.duration || 3000,
                showConfirm: params.showConfirm || false,
                onConfirm: params.onConfirm,
            })
        }
    }

    const hideToast = () => {
        setToast(null)
    }

    return {
        Toast: toast ? <ToastComponent {...toast} onClose={hideToast} /> : null,
        showToast,
        hideToast,
    }
}

export { useToast }
