import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'


const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

const DEFAULT_IMAGE_URL = "https://i.pinimg.com/736x/f0/bc/0d/f0bc0d4bb78706f1b3a92097bd79dd4f.jpg"



const CreateServiceForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, user } = useAuthService()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const initialFormState = {
        name: '',
        description: '',
        price: '',
        location: '',
        contact: '',
        picture_url: '',

    }

    const [formData, setFormData] = useState(initialFormState)

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/signin')
            return
        }

        if (id) {
            fetchServices()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isLoggedIn, navigate])

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_HOST}/api/services/${id}`, {
                credentials: 'include',
            })
            const data = await response.json()

            if (data.success) {
                const service = data.data
                setFormData({
                    name: service.name,
                    description: service.description,
                    price: service.price,
                    location: service.location,
                    contact: service.contact,
                    picture_url: service.picture_url || '',
                })
            } else {
                setError(data.error || 'Failed to load service')
            }
        } catch (err) {
            setError('Failed to fetch service')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const url = id
                ? `${API_HOST}/api/services/${id}`
                : `${API_HOST}/api/services`
            const method = id ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    picture_url: formData.picture_url || DEFAULT_IMAGE_URL,
                    created_by: user.id,
                }),
            })

            const data = await response.json()

            if (data.success) {
                navigate('/services')
            } else {
                setError(data.error || 'Failed to save service')
            }
        } catch (err) {
            setError('Failed to save service')
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
                    <h1 className="text-3xl font-bold text-black"></h1>
                    <button
                        onClick={() => navigate('/services')}
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
                    <h2 className="text-xl font-semibold mb-2">
                        Add Services
                    </h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="grid gap-6">
                        <div>

                            <input
                                type="text"
                                name="name"
                                placeholder="Service Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                placeholder="Price no decimals"
                                onChange={handleChange}
                                className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    placeholder="Location"
                                    onChange={handleChange}
                                    className="w-full p-2 border border-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        placeholder="Contact Information"
                                        onChange={handleChange}
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
                                    {id ? 'Update' : 'Create Service'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateServiceForm
