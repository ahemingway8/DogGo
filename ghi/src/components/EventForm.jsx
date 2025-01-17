import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthService from "../hooks/useAuthService";

const EventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthService();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const initialFormState = {
        title: '',
        description: '',
        date: '',
        location: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/signin');
            return;
        }

        if (id) {
            fetchEvent();
        }
    }, [id, isLoggedIn, navigate]);

    const fetchEvent = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/events/${id}`);
            const data = await response.json();

            if (data.success) {
                setFormData({
                    title: data.data.title,
                    description: data.data.description,
                    date: data.data.date,
                    location: data.data.location,
                });
            } else {
                setError('Failed to load event');
            }
        } catch (err) {
            setError('Failed to fetch event');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const url = id ? `/api/events/${id}` : '/events';
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                navigate('/events');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to save event');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F8B51]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {id ? 'Edit Event' : 'Create New Event'}
                </h1>
                <button
                    onClick={() => navigate('/events')}
                    className="px-4 py-2 text-[#6F8B51] border border-[#6F8B51] rounded-lg hover:bg-[#6F8B51] hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            EventTitle
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none fovus:ring-2 focus:ring-[#6F8B51] focus:border-transparent"
                            required
                            />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F8B51] focus:border-transparent"
                            rows="3"
                            required
                            />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F8B51] focus:border-transparent"
                            required
                            />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F8B51] focus:border-transparent"
                            required
                            />
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full px-6 py-2 bg-[#6F8B51] text-white rounded-lg bover:bg-[#5a7242] transition-colors"
                        >
                            {id ? 'Update Event' : 'Create Event'}
                        </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
