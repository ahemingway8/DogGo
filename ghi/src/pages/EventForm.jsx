import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

const DEFAULT_IMAGE_URL = "https://i.pinimg.com/736x/f0/bc/0d/f0bc0d4bb78706f1b3a92097bd79dd4f.jpg"

const EventForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn } = useAuthService()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const initialFormState = {
        name: '',
        description: '',
        address: '',
        date_time: '',
        picture_url: '',
    }

    const [formData, setFormData] = useState(initialFormState)

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/signin')
            return
        }

        if (id) {
            fetchEvent()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isLoggedIn, navigate])

    const fetchEvent = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_HOST}/api/events/${id}`, {
                credentials: 'include',
            })
            const data = await response.json()

            if (data.success) {
                const event = data.data
                setFormData({
                    name: event.name,
                    description: event.description,
                    address: event.address,
                    date_time: event.date_time
                        ? new Date(event.date_time).toISOString().split('T')[0]
                        : '',
                    picture_url: event.picture_url || '',
                })
            } else {
                setError(data.error || 'Failed to load event')
            }
        } catch (err) {
            setError('Failed to fetch event')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const url = id
                ? `${API_HOST}/api/events/${id}`
                : `${API_HOST}/api/events`
            const method = id ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    date_time: new Date(formData.date_time).toISOString(),
                    picture_url: formData.picture_url || DEFAULT_IMAGE_URL,
                }),
            })

            const data = await response.json()

            if (data.success) {
                navigate('/my-events')
            } else {
                setError(data.error || 'Failed to save event')
            }
        } catch (err) {
            setError('Failed to save event')
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
        <div className="max-w-2xl mx-auto px-4 py-6 relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">
                        {id ? 'Edit Event' : 'Create New Event'}
                    </h1>
                    <button
                        onClick={() => navigate('/my-events')}
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
                                Event Name
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
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
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
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Date
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.date_time}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        date_time: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
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
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-white text-black rounded-lg hover:bg-gray transition-colors"
                        >
                            {id ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EventForm
