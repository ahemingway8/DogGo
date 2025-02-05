import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'
import { useToast } from '../hooks/useToast'


const ServicesListPage = () => {
    const [services, setServices] = useState([])
    const [filteredServices, setFilteredServices] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { user } = useAuthService()
    const { showToast, hideToast, Toast} = useToast()


    useEffect(() => {
        fetchServices()
    }, [])

    useEffect(() => {
        filterServices()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, services])

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('http://localhost:8000/api/services')
            const data = await response.json()

            if (data.success) {
                setServices(data.data)
            } else {
                setError(data.error || 'Failed to load services')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const filterServices = () => {
        if (!searchTerm) {
            setFilteredServices(services)
            return
        }

        const filtered = services.filter(
            (service) =>
                service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredServices(filtered)
    }

    const handleDelete = async (serviceId) => {
        showToast({
            message: 'Are you sure you want to delete this service?',
            showConfirm: true,
            onConfirm: async () => {
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
                        hideToast()
                    } else {
                        setError(data.error || 'Failed to delete service.')
                    }
                } catch (error) {
                    console.error('Error deleting service:', error)
                    setError('Failed to delete service.')
                }
            }
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F8B51]"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {Toast}
            <div className="mb-8">
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-center text-4xl font-bold text-black">
                            Pet Services
                        </h1>
                        <button
                            onClick={() => navigate('/services/create')}
                            className="px-4 py-2 bg-green text-xl text-white rounded-lg hover:bg-dark-green transition-colors"
                        >
                            Post a Service
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="w-6 h-6 -mt-0.5 absolute left-3 top-1/2 transform -translate-y-1/2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M32.4,26.2l8.1,8.1c1.7,1.7 1.7,4.5 0,6.2v0c-1.7,1.7 -4.5,1.7 -6.2,0l-4.3,-4.3"></path>
                            <path d="M8,25c-1.8,-4.7 -0.8,-10.2 3,-14c3.8,-3.8 9.5,-4.8 14.2,-2.9"></path>
                            <path d="M31.3,13.1c3.4,5.1 2.8,12.1 -1.7,16.6c-4.9,4.9 -12.6,5.1 -17.7,0.8"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-lg w-full pl-10 pr-4 py-2 -mt-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        />
                    </div>

                    {error && (
                        <div className="bg-red text-black p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {filteredServices.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-black">
                                No services found
                            </h3>
                            <p className="text-black mt-2">
                                Be the first to aadd a service!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((service) => (
                                <div
                                    key={service.id}
                                    className="bg-light-green rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-8 border-light-green overflow-hidden"
                                >
                                    {service.picture_url && (
                                        <div className="w-full h-50 overflow-hidden">
                                            <img
                                                src={service.picture_url}
                                                alt={service.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-2xl font-semibold text-white mb-2">
                                            {service.name}
                                        </h2>
                                        <p className="text-white mb-2">
                                            {service.description}
                                        </p>
                                        <div className="text-white">
                                            <p>Price: ${service.price}</p>
                                            <p>Location: {service.location}</p>
                                            <p>Contact: {service.contact}</p>
                                        </div>

                                        {user && user.id === service.created_by && (
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="w-full px-4 py-2 bg-red text-white rounded-lg hover:bg-dark-red transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ServicesListPage
