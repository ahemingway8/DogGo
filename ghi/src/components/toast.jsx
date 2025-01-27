import { useState, useEffect } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
const ToastComponent = ({
    message,
    duration = 3000,
    onClose,
    showConfirm = false,
    onConfirm,
}) => {
    useEffect(() => {
        if (!showConfirm) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose, showConfirm])
    if (showConfirm) {
        return (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 text-black z-20 min-w-[200px]">
                <p className="text-sm font-medium text-center">{message}</p>
                <div className="flex justify-end gap-2 mt-3">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1 bg-red text-white rounded hover:bg-dark-red"
                    >
                        Delete
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 text-black duration-500 ease-in-out opacity-100 translate-t-0 animate-bounce z-20 min-w-[200px]">
            <p className="text-sm font-medium text-center">{message}</p>
        </div>
    )
}

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
