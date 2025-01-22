import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthService from '../hooks/useAuthService';

const API_HOST = import.meta.env.VITE_API_HOST;

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined');
}

const EventsListPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuthService();

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [searchTerm, events]);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_HOST}/api/events`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setEvents(data.data);
            } else {
                setError(data.error || 'Failed to load events');
            }
        } catch (err) {
            setError('Failed to fetch events');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterEvents = () => {
        if (!searchTerm) {
            setFilteredEvents(events);
            return;
        }

        const filtered = events.filter(
            (event) =>
                event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredEvents(filtered);
    };

    const handleCreateEventClick = () => {
        if (isLoggedIn) {
            navigate('/events/new');
        } else {
            navigate('/signin');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const response = await fetch(`${API_HOST}/api/events/${eventId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                await fetchEvents(); // Refresh the events list
            } else {
                setError(data.error || 'Failed to delete event');
            }
        } catch (err) {
            setError('Failed to delete event');
            console.error(err);
        }
    };

    const formatDateTime = (dateTimeStr) => {
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (err) {
            console.error('Error formatting date:', err);
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

    const canModifyEvent = (event) => {
        return user && event.created_by === user.id;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Dog Events</h1>
                    <button
                        onClick={handleCreateEventClick}
                        className="px-4 py-2 bg-[#6F8B51] text-white rounded-lg hover:bg-[#5a7242] transition-colors"
                    >
                        Create Event
                    </button>
                </div>

                <div className="relative mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F8B51] focus:border-transparent"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-600">
                        No events found
                    </h3>
                    <p className="text-gray-500 mt-2">
                        Check back later for more events!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 overflow-hidden"
                        >
                            {event.picture_url && (
                                <div className="w-full h-46 overflow-hidden">
                                    <img
                                        src={event.picture_url}
                                        alt={event.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {event.name}
                                </h3>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 mr-2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                            />
                                        </svg>
                                        {formatDateTime(event.date_time)}
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 mr-2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                            />
                                        </svg>
                                        {event.address}
                                    </div>
                                </div>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/events/${event.id}`)}
                                            className="px-4 py-2 bg-[#6F8B51] text-white rounded-lg hover:bg-[#5a7242] transition-colors"
                                        >
                                            View Details
                                        </button>
                                        {isLoggedIn && canModifyEvent(event) && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/events/edit/${event.id}`)}
                                                    className="px-4 py-2 border border-[#6F8B51] text-[#6F8B51] rounded-lg hover:bg-[#6F8B51] hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsListPage;
