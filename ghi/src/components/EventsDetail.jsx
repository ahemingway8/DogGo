import useAuthService from '../hooks/useAuthService';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_HOST = import.meta.env.VITE_API_HOST;

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined');
}

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuthService();

    useEffect(() => {
        fetchEventDetail();
    }, [id]);

    const fetchEventDetail = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_HOST}/api/events/${id}`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setEvent(data.data);
            } else {
                setError(data.error || 'Failed to load event details')
            }
        } catch (err) {
            setError('Failed to fetch event details');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateTimeStr) => {
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (err) {
            return dateTimeStr;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F8B51]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600">{error}</h3>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const response = await fetch(`${API_HOST}/api/events/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                navigate('/events');
            } else {
                setError(data.error || 'Failed to delete event');
            }
        } catch (err) {
            setError('Failed to delete event');
        }
    };

    const canModifyEvent = user && event && event.created_by === user.id;

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{event?.name}</h1>
                </div>

                {event.picture_url ? (
                    <div className="w-full h-80 overflow-hidden mb-6">
                        <img
                            src={event.picture_url}
                            alt={event.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-80 bg-gray-300 mb-6 flex justify-center items-center">
                        <span className="text-gray-500">No image available</span>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Event Details</h3>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p className="mb-4">
                            <strong>Date/Time: </strong>
                            {formatDate(event.date_time)}
                        </p>
                        <p className="mb-4">
                            <strong>Address: </strong>
                            {event.address}
                        </p>
                        <p className="mb-4">
                            <strong>Description: </strong>
                            {event.description}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/events')}
                        className="mt-4 px-4 py-2 bg-[#6F8B51] text-white rounded-lg hover:bg-[#5a7242] transition-colors"
                    >
                        Back to Events List
                    </button>
                    {canModifyEvent && (
                            <>
                                <button
                                    onClick={() => navigate(`/events/edit/${id}`)}
                                    className="px-4 py-2 bg-[#6F8B51] text-white rounded-lg hover:bg-[#5a7242] transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                </div>
            </div>
        </div>
    );

};

export default EventDetailPage;
