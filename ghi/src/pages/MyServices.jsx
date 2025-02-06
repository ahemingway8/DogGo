import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import useAuthService from '../hooks/useAuthService'

const API_HOST = import.meta.env.VITE_API_HOST

const MyServices = () => {
    const [services, setServices] = useState([])
    const [filteredServices, setFilteredServices] = useState([])
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const { user } = useAuthService()
    const { showToast, hideToast, Toast } = useToast()

    const fetchAndFilterServices = async () => {
        if (!searchTerm) {
            try {
                const response = await fetch(`${API_HOST}/api/services`, {
                    credentials: 'include',
                })
                const data = await response.json()

                if (data.success) {
                    const userServices = data.data.filter(
                        service => service.created_by === user?.id
                    )
                    setServices(userServices)
                    setFilteredServices(userServices)
                } else {
                    setError(data.error || 'Failed to load services')
                }
            } catch (err) {
                setError('Failed to fetch services')
                console.error(err)
            }
        } else {
            const filtered = services.filter(
                (service) =>
                    service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.location?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredServices(filtered)
        }
    }

    const handleDeleteService = async (serviceId) => {
        showToast({
            message: 'Are you sure you want to delete this service?',
            showConfirm: true,
            onConfirm: () => confirmDelete(serviceId),
        })
    }

    const confirmDelete = async (serviceId) => {
        try {
            const response = await fetch(`${API_HOST}/api/services/${serviceId}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            const data = await response.json()

            if (data.success) {
                hideToast()
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === serviceId ? { ...service, deleted: true } : service
                    )
                )
                setFilteredServices((prevFilteredServices) =>
                    prevFilteredServices.map((service) =>
                        service.id === serviceId ? { ...service, deleted: true } : service
                    )
                )
            } else {
                setError(data.error || 'Failed to delete service')
            }
        } catch (err) {
            setError('Failed to delete service')
            console.error(err)
        }
    }

    useEffect(() => {
        fetchAndFilterServices()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, user?.id])

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {Toast}
            <div className="mb-8">
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-center text-4xl font-bold text-black">
                            My Services
                        </h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/services')}
                                className="px-4 py-2 bg-green text-xl text-white rounded-lg hover:bg-dark-green transition-colors"
                            >
                                All Services
                            </button>
                            <button
                                onClick={() => navigate('/services/create')}
                                className="px-4 py-2 bg-green text-xl text-white rounded-lg hover:bg-dark-green transition-colors"
                            >
                                Post Service
                            </button>
                        </div>
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
                        placeholder="Search your services..."
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

                    {filteredServices.filter(service => !service.deleted).length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-black">
                                You have not posted any services yet
                            </h3>
                            <p className="text-black mt-2">
                                Create your first service listing to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.filter(service => !service.deleted).map((service) => (
                                <div
                                    key={service.id}
                                    className="bg-light-green rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-8 border-light-green overflow-hidden"
                                >
                                    {service.picture_url && (
                                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                                            <img
                                                src={service.picture_url}
                                                alt={service.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-2xl text-center font-semibold text-white mb-4">
                                            {service.name}
                                        </h2>
                                        <div className="space-y-2 text-white">
                                            <p>Price: ${service.price}</p>
                                            <p>Location: {service.location}</p>
                                            <p>Contact: {service.contact}</p>
                                        </div>
                                        <div className="mt-4 flex justify-between gap-2">
                                            <button
                                                onClick={() => navigate(`/services/${service.id}`)}
                                                className="w-20 px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => navigate(`/services/edit/${service.id}`)}
                                                className="w-20 px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                className="w-20 px-4 py-2 border border-red bg-red text-white rounded-lg hover:bg-dark-red hover:text-white transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
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

export default MyServices
