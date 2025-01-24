import { useState, useEffect } from "react";

const ToastComponent = ({ message, duration = 3000, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose()
    }, duration)

    return () => clearTimeout(timer)
    }, [duration, onClose])
    return (
        <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 text-black duration-500 ease-in-out opacity-100 translate-t-0 animate-bounce z-20">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                            />
                    </svg>
                </div>
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    )
}

const useToast = () => {
    const [toast, setToast] = useState(null)

    const showToast = (message, duration = 3000) => {
        setToast({ message, duration })
    }

    const hideToast = () => {
        setToast(null)
    }
    return{
        Toast: toast ? (
        <ToastComponent
        message={toast.message}
        duration={toast.duration}
        onClose={hideToast}
        />
        ) : null,
        showToast,
        hideToast
    }
}

export { useToast }
