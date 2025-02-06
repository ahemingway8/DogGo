import useAuthService from "../hooks/useAuthService"
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'

const ServiceDetail = () => {
    const { id } = useParams()
    const [service, setService] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { showToast, hideToast, Toast } = useToast()
    const { user } = useAuthService()

    useEffect(() => {
        fetchServiceDetail()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchServiceDetail = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`http://localhost:8000/api/services/${id}`, {
                credentials: 'include',
            })
            const data = await response.json()
            if (data.success) {
                setService(data.data)
            } else {
                setError(data.error || 'Failed to load service details')
            }
        } catch (err) {
            setError('Failed to fetch service details')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = () => {
        showToast({
            message: 'Are you sure you want to delete this service?',
            showConfirm: true,
            onConfirm: confirmDelete,
        })
    }

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/apip/services${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            const data = await response.json()
            if (data.success) {
                hideToast()
                navigate('/my-services')
            } else {
                setError(data.error || 'Failed to delete service')
            }
        } catch (err) {
            setError('Failed to delete service')
        }
    }

    const canModifyService = user && service && service.created_by === user.id

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F8B51"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600">{error}</h3>
            </div>
        )
    }

    return (
        <>
            {Toast}
            <div className="max-w-6xl mx-auto px-4 py-6 bg-white/20 backgrop-blur-sm rounded-lg">
                <div className="mb-8 rounded-lg p-4">
                    <div className="flex justify-center items-center mb-6">
                        <h1 className="text-4xl font-bold text-black mt-4">
                            {service?.name}
                        </h1>
                    </div>

                    {service.picture_url ? (
                        <div className="max-w-md mx-auto h-auto mb-6 rounded-lg">
                            <img
                                src={service.picture_url}
                                alt={service.name}
                                className="w-full h-auto object-contain rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto h-80 bg-light-green mb-6 flex justify-center items-center rounded-lg">
                            <span className="text-white">No image available</span>
                        </div>
                    )}

                    <div className="bg-light-green rounded-lg shadow-md border border-light-green p-6">
                        <div className="mb-4">
                            <h3 className="text-3xl font-semibold text-white">
                                Service Details
                            </h3>
                        </div>
                        <div className="text-xl font-normal text-white space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">Price: </span>
                                <span>${service.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">Location: </span>
                                <span>{service.location}</span>
                            </div>
                            <p className="mt-4">
                                <span className="font-semibold">Description: </span>
                                {service.description}
                            </p>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => navigate('/services')}
                                className="text-lg px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                            >
                                Back to Services List
                            </button>
                            {canModifyService && (
                                <>
                                <button
                                    onClick={() => navigate('/my-services')}
                                    className="text-lg px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                                >
                                    My Services
                                </button>
                                <button
                                    onClick={() => navigate(`/services/edit/${id}`)}
                                    className="text-lg px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-lg px-4 py-2 border border-red bg-red text-white rounded-lg hover:bg-dark-green transition-colors"
                                >
                                    Delete
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceDetail
