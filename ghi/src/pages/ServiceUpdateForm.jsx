import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

const ServiceUpdateForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, user } = useAuthService()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        location: '',
        contact: '',
        picture_url: '',
        created_by: null,
    })

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/signin')
            return
        }
        if (id) {
            fetchService()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isLoggedIn])

    const fetchService = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_HOST}/api/services/${id}`, {
                credentials: 'include',
            })
            const data = await response.json()

            if (data.success) {
                const service = data.data
                if (service.created_by !== user?.id) {
                    setError("You don't have permission to edit this service")
                    navigate('/services')
                    return
                }

                setFormData({
                    name: service.name,
                    description: service.description,
                    price: service.price,
                    location: service.location,
                    contact: service.contact,
                    picture_url: service.picture_url || '',
                    created_by: service.created_by,
                })
            } else {
                setError(data.error || 'Failed to load service')
                navigate('/services')
            }
        } catch (err) {
            setError('Failed to fetch service')
            console.error(err)
            navigate('/services')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!user || formData.created_by !== user.id) {
            setError("You don't have permission to edit this service")
            return
        }

        try {
            const response = await fetch(`${API_HOST}/api/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    picture_url: formData.picture_url || null,
                    created_by: user.id,
                }),
            })

            const data = await response.json()

            if (data.success) {
                navigate('/my-services')
            } else {
                setError(data.error || 'Failed to update service')
            }
        } catch (err) {
            setError('Failed to update service')
            console.error(err)
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
        <>
            <div className="max-w-6xl mx-auto px-4 py-6 bg-white/20 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">
                        Edit Service
                    </h1>
                    <button
                        onClick={() => navigate('/my-services')}
                        className="px-4 py-2 text-white border border-green bg-green rounded-lg hover:bg-dark-green hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
                {error && (
                    <div className="bg-red text-black p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}
                <form
                    onSubmit={handleSubmit}
                    className="bg-light-green p-6 rounded-lg shadow-md"
                >
                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Service name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                rows="3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Contact Information
                            </label>
                            <input
                                type="text"
                                value={formData.contact}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        contact: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Picture URL (optional)
                            </label>
                            <input
                                type="url"
                                value={formData.picture_url || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        picture_url: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                placeholder="url('../public/service-placeholder.jpg')"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                        >
                            Update Service
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ServiceUpdateForm
