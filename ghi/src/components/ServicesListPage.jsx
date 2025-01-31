import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'

const ServicesListPage = () => {
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { user } = useAuthService()


    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('http://localhost:8000/api/services')
            const data = await response.json()
            console.log(data)

            if (data.success) {
                setServices(data.data)
            } else {
                setError(data.error || 'Failed to load services')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?'))
            return

        try {
            const response = await fetch(
                `http://localhost:8000/api/services/${serviceId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            )

            const data = await response.json()
            if (data.success) {
                setServices(
                    services.filter((service) => service.id !== serviceId)

                )

            } else {
                alert(data.error || 'Failed to delete service.')
            }
        } catch (error) {
            console.error('Error deleting service:', error)
            alert('Failed to delete service.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F8B51]"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mt-20 mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Available Services</h1>
                <button
                    onClick={() => navigate('/services/create')}
                    className="px-4 py-2 text-white border border-green bg-green rounded-lg hover:bg-dark-green hover:text-white transition-colors"
                >
                    Create New Service
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-6 relative z-10">
                {services.map((service) => {
                    return (
                        <li
                            key={service.id}
                            className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {service.picture_url && (
                                <img
                                    src={service.picture_url}
                                    alt={service.name}
                                    className="w-full h-64 object-cover rounded-t-lg mb-4"
                                />
                            )}
                            <h2 className="text-xl font-semibold text-gray-800">
                                {service.name}
                            </h2>
                            <p className="text-gray-600">
                                {service.description}
                            </p>
                            <p className="text-gray-500">
                                Price: ${service.price}
                            </p>
                            <p className="text-gray-500">
                                Location: {service.location}
                            </p>
                            <p className="text-gray-500">
                                Contact: {service.contact}
                            </p>

                            {/* Show delete button if user created the service */}
                            {user && user.id === service.created_by && (
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                    style={{ backgroundColor: '#dc2626' }} // Force a red background color
                                >
                                    Delete
                                </button>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ServicesListPage
