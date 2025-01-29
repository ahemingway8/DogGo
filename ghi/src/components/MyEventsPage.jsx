import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './toast';
import useAuthService from '../hooks/useAuthService';

const API_HOST = import.meta.env.VITE_API_HOST

const MyEventsPage = () => {
    const [events, setEvents] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([])
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const { user } = useAuthService()
    const { showToast, hideToast, Toast } = useToast()

    useEffect(() => {
        const fetchAndFilterEvents = async () => {
            if (!searchTerm) {
                try {
                    const response = await fetch(`${API_HOST}/api/events`, {
                        credentials: 'include',
                    });
                    const data = await response.json();

                    if (data.success) {
                        const userEvents = data.data.filter(
                            event => event.created_by === user?.id
                        );
                        setEvents(userEvents);
                        setFilteredEvents(userEvents);
                    } else {
                        setError(data.error || 'Failed to load events');
                    }
                } catch (err) {
                    setError('Failed to fetch events');
                    console.error(err);
                }
            } else {
                const filtered = events.filter(
                    (event) =>
                        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.address?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredEvents(filtered);
            }
        };

        fetchAndFilterEvents();
    }, [searchTerm, user?.id]);

    const handleDeleteEvent = async (eventId) => {
        showToast({
            message: 'Are you sure you want to delete this event?',
            showConfirm: true,
            onConfirm: () => confirmDelete(eventId),
        })
    }

    const confirmDelete = async (eventId) => {
        try {
            const response = await fetch(`${API_HOST}/api/events/${eventId}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            const data = await response.json()

            if (data.success) {
                hideToast()
                setEvents(events.filter(event => event.id !== eventId))
            } else {
                setError(data.error || 'Failed to delete event')
            }
        } catch (err) {
            setError('Failed to delete event')
            console.error(err)
        }
    }

    const formatDateTime = (dateTimeStr) => {
        try {
            const date = new Date(dateTimeStr)
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch (err) {
            console.error('Error formatting date:', err)
            return dateTimeStr
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {Toast}
            <div className="mb-8">
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-center text-4xl font-bold text-black">
                            My Events
                        </h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/events')}
                                className="px-4 py-2 bg-green text-xl text-white rounded-lg hover:bg-dark-green transition-colors"
                            >
                                All Events
                            </button>
                            <button
                                onClick={() => navigate('/events/new')}
                                className="px-4 py-2 bg-green text-xl text-white rounded-lg hover:bg-dark green transition-colrs"
                            >
                                Create Event
                            </button>
                        </div>
                    </div>

                    <div  className="relative mb-6">
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
                            placeholder="Search your events..."
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

                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-black">
                                You haven't created any events yet
                            </h3>
                            <p className="text-black mt-2">
                                Create your first event to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-light-green rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-8 border-light-green overflow-hidden"
                                >
                                    {event.picture_url && (
                                        <img
                                            src={event.picture_url}
                                            alt={event.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-2xl text-center font-semibold text-white mb-2">
                                            {event.name}
                                        </h3>

                                        <div className="flex flex-wrap gap-4 text-lg text-white">
                                            <div className="flex items-center">
                                                <svg
                                                    className="h-8 w-8 mr-2"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0,0,256,256"
                                                    width="48px"
                                                    height="48px"
                                                    fillRule="nonzero"
                                                >
                                                    <g
                                                        fill="none"
                                                        fillRule="nonzero"
                                                        stroke="#f3f3f3"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeMiterlimit="10"
                                                        strokeDasharray=""
                                                        strokeDashoffset="0"
                                                        fontFamily="none"
                                                        fontWeight="none"
                                                        fontSize="none"
                                                        textAnchor="none"
                                                    >
                                                        <g transform="scale(5.33333,5.33333)">
                                                            <path d="M40.5,31.2v4.3c0,2.8 -2.2,5 -5,5h-23c-2.8,0 -5,-2.2 -5,-5v-13.5"></path>
                                                            <path d="M7.5,15.2v-2.7c0,-2.8 2.2,-5 5,-5h23c2.8,0 5,2.2 5,5v12.1"></path>
                                                            <path d="M7.5,15.5h33"></path>
                                                            <path d="M14.5,5v4.5"></path>
                                                            <path d="M33.5,5v4.5"></path>
                                                        </g>
                                                    </g>
                                                </svg>
                                                {formatDateTime(event.date_time)}
                                            </div>
                                            <div className="flex items-center">
                                                <svg
                                                    className="h-8 w-8 mr-2"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 48 48"
                                                    width="48"
                                                    height="48"
                                                >
                                                    <g fill="none" stroke="#f3f3f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M35.8,31.1c2.3-2.7 3.7-6.2 3.7-10.1c0-8.6-6.9-15.5-15.5-15.5c-3,0-5.8,0.9-8.2,2.3" />
                                                        <path d="M10.4,13.6c-1.2,2.2-1.9,4.7-1.9,7.4c0,3.8 1.4,7.3 3.7,10.1c0,0 7.4,8.4 9.7,10.6c1.2,1.1 3,1.1 4.1,0c1.5-1.4 3.2-3.3 5.4-5.8" />
                                                        <g transform="translate(14,10) scale(0.4)" fill="#f3f3f3" stroke="none">
                                                            <path d="M 17 3 A 1.50015 1.50015 0 1 0 17 6 C 18.494256 6 20 7.6252653 20 10 C 20 12.374735 18.494256 14 17 14 C 15.505744 14 14 12.374735 14 10 C 14 9.3543874 14.117022 8.7488633 14.318359 8.21875 A 1.50015 1.50015 0 1 0 11.513672 7.1542969 C 11.181009 8.0301835 11 8.9936126 11 10 C 11 13.701265 13.524256 17 17 17 C 20.475744 17 23 13.701265 23 10 C 23 6.2987347 20.475744 3 17 3 z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                                {event.address}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between gap-2">
                                            <button
                                                onClick={() => navigate(`/events/${event.id}`)}
                                                className="px-4 py-2 bg-green text-white rounded-l hover:bg-dark-green hover:text-white transition-colors"
                                            >
                                                Edit
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
    );
};

export default MyEventsPage;
