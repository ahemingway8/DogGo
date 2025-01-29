import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

const PawPrint = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="125"
        height="125"
        viewBox="0 0 48 48"
        className={`fill-dark-tan ${className}`}
    >
        <path d="M 17 3 A 1.50015 1.50015 0 1 0 17 6 C 18.494256 6 20 7.6252653 20 10 C 20 12.374735 18.494256 14 17 14 C 15.505744 14 14 12.374735 14 10 C 14 9.3543874 14.117022 8.7488633 14.318359 8.21875 A 1.50015 1.50015 0 1 0 11.513672 7.1542969 C 11.181009 8.0301835 11 8.9936126 11 10 C 11 13.701265 13.524256 17 17 17 C 20.475744 17 23 13.701265 23 10 C 23 6.2987347 20.475744 3 17 3 z M 31 3 C 27.524256 3 25 6.2987347 25 10 C 25 13.701265 27.524256 17 31 17 A 1.50015 1.50015 0 1 0 31 14 C 29.505744 14 28 12.374735 28 10 C 28 7.6252653 29.505744 6 31 6 C 32.494256 6 34 7.6252653 34 10 C 34 10.82345 33.808539 11.580467 33.496094 12.203125 A 1.5001758 1.5001758 0 1 0 36.177734 13.548828 C 36.705289 12.497486 37 11.28455 37 10 C 37 6.2987347 34.475744 3 31 3 z M 8 16 C 4.7736242 16 2.3566159 18.866029 2.0371094 22.212891 A 1.50015 1.50015 0 1 0 5.0234375 22.498047 C 5.225931 20.376908 6.6123758 19 8 19 C 9.4942555 19 11 20.625265 11 23 C 11 25.374735 9.4942555 27 8 27 C 7.4771264 27 6.994296 26.827346 6.5371094 26.480469 A 1.5006106 1.5006106 0 1 0 4.7226562 28.871094 C 5.6414697 29.568217 6.7828736 30 8 30 C 11.475744 30 14 26.701265 14 23 C 14 19.298735 11.475744 16 8 16 z M 40 16 C 36.524256 16 34 19.298735 34 23 C 34 26.701265 36.524256 30 40 30 C 43.475744 30 46 26.701265 46 23 C 46 21.612536 45.656746 20.30806 45.042969 19.199219 A 1.5001831 1.5001831 0 1 0 42.417969 20.652344 C 42.776191 21.299503 43 22.109464 43 23 C 43 25.374735 41.494256 27 40 27 C 38.505744 27 37 25.374735 37 23 C 37 20.625265 38.505744 19 40 19 A 1.50015 1.50015 0 1 0 40 16 z M 24 19 C 20.790583 19 18.642899 21.429382 17.460938 23.753906 A 1.50015 1.50015 0 1 0 20.134766 25.113281 C 21.052804 23.307805 22.319417 22 24 22 C 25.560111 22 26.724684 23.058996 27.638672 24.640625 C 28.55266 26.222254 29 28.290991 29 29 C 29 29.922188 29.388991 30.756426 29.841797 31.326172 C 30.294603 31.895917 30.780191 32.282068 31.201172 32.658203 C 32.043134 33.410474 32.659418 33.986385 32.910156 35.402344 C 33.169406 36.864135 32.789034 38.252823 32.003906 39.279297 A 1.50015 1.50015 0 1 0 34.386719 41.101562 C 35.683591 39.406036 36.268032 37.161115 35.863281 34.878906 C 35.46502 32.629865 34.138507 31.259151 33.199219 30.419922 C 32.729575 30.000307 32.364054 29.678676 32.189453 29.458984 C 32.014853 29.239292 32 29.202312 32 29 C 32 27.418009 31.44734 25.236246 30.236328 23.140625 C 29.025316 21.045004 26.939889 19 24 19 z M 17.320312 28.292969 A 1.50015 1.50015 0 0 0 15.964844 29.246094 C 15.883494 29.44557 15.289195 29.959033 14.378906 30.826172 C 13.468617 31.693311 12.407056 33.058191 12.101562 35.087891 C 11.423512 39.58947 14.706583 43.90101 19.332031 43.998047 A 1.50015 1.50015 0 0 0 19.333984 43.998047 C 21.105527 44.034437 22.664274 43.333664 23.982422 42.324219 C 25.192725 43.259416 26.60509 43.936307 28.21875 43.994141 A 1.50015 1.50015 0 1 0 28.326172 40.996094 C 27.025602 40.949483 25.908347 40.39754 25.125 39.507812 A 1.50015 1.50015 0 0 0 22.875 39.507812 C 22.036634 40.459995 20.817193 41.029222 19.394531 41 C 16.583979 40.94104 14.636458 38.389577 15.066406 35.535156 C 15.260913 34.242856 15.759555 33.653158 16.447266 32.998047 C 17.134977 32.342936 18.175535 31.76843 18.742188 30.378906 A 1.50015 1.50015 0 0 0 17.320312 28.292969 z" />
    </svg>
)

const EventsListPage = () => {
    const [events, setEvents] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const { isLoggedIn, user } = useAuthService()

    useEffect(() => {
        fetchEvents()
    }, [])

    useEffect(() => {
        filterEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, events])

    const fetchEvents = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_HOST}/api/events`, {
                credentials: 'include',
            })
            const data = await response.json()

            if (data.success) {
                setEvents(data.data)
            } else {
                setError(data.error || 'Failed to load events')
            }
        } catch (err) {
            setError('Failed to fetch events')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const filterEvents = () => {
        if (!searchTerm) {
            setFilteredEvents(events)
            return
        }

        const filtered = events.filter(
            (event) =>
                event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                event.address?.toLowerCase().includes(searchTerm.toLowerCase())
        )

        setFilteredEvents(filtered)
    }

    const handleCreateEventClick = () => {
        if (isLoggedIn) {
            navigate('/events/new')
        } else {
            navigate('/signin')
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F8B51]"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-9">
                <PawPrint className="absolute z-[-1] -rotate-45 top-12 left-12 text-dark-tan opacity-80 scale-75" />
                <PawPrint className="absolute z-[-2] -rotate-12 top-24 left-1/4 text-dark-tan opacity-30" />
                <PawPrint className="absolute z-[-3] rotate-45 top-16 right-1/3 text-dark-tan opacity-50 scale-90" />
                <PawPrint className="absolute z-[-4] -rotate-90 top-8 right-24 text-dark-tan opacity-70 scale-75" />

                <PawPrint className="absolute z-[-5] rotate-12 top-1/3 left-36 text-dark-tan opacity-25 scale-110" />
                <PawPrint className="absolute z-[-6] -rotate-30 top-1/2 left-1/4 text-dark-tan opacity-90" />
                <PawPrint className="absolute z-[-7] rotate-60 top-1/2 right-1/4 text-dark-tan opacity-40" />
                <PawPrint className="absolute z-[-8] -rotate-15 top-1/3 right-36 text-dark-tan opacity-20 scale-90" />

                <PawPrint className="absolute z-[-9] rotate-90 bottom-24 left-24 text-dark-tan opacity-75 scale-75" />
                <PawPrint className="absolute z-[-10] rotate-45 bottom-36 left-1/3 text-dark-tan opacity-60" />
                <PawPrint className="absolute z-[-11] -rotate-45 bottom-48 right-1/3 text-dark-tan opacity-75 scale-110" />
                <PawPrint className="absolute z-[-12] rotate-180 bottom-24 right-24 text-dark-tan opacity-35 scale-75" />

                <PawPrint className="absolute z-[-13] rotate-15 top-1/2 left-1/2 text-dark-tan opacity-80 scale-125" />
                <PawPrint className="absolute z-[-14] -rotate-75 bottom-1/3 left-1/2 text-dark-tan opacity-45 scale-90" />
                <PawPrint className="absolute z-[-15] rotate-30 top-2/3 right-1/2 text-dark-tan opacity-25 scale-100" />
            </div>
            <div className="mb-8">
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-center text-4xl font-bold text-black">
                            Dog Events
                        </h1>
                        <button
                            onClick={handleCreateEventClick}
                            className="px-4 py-2 bg-green text-xl text-white rounded-lg hover:bg-dark-green transition-colors"
                        >
                            Create Event
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
                            <path d="M32.4,26.2l8.1,8.1c1.7,1.7 1.7,4.5 0,6.2v0c-1.7,1.7 -4.5,1.7 -6.2,0l-4.3,-4.3"></path><path d="M8,25c-1.8,-4.7 -0.8,-10.2 3,-14c3.8,-3.8 9.5,-4.8 14.2,-2.9"></path>
                            <path d="M31.3,13.1c3.4,5.1 2.8,12.1 -1.7,16.6c-4.9,4.9 -12.6,5.1 -17.7,0.8"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search events..."
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
                                No events found
                            </h3>
                            <p className="text-black mt-2">
                                Check back later for more events!
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
                                        <div className="w-full h-50 overflow-hidden rounded-t-lg">
                                            <img
                                                src={event.picture_url}
                                                alt={event.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
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
                                                {formatDateTime(
                                                    event.date_time
                                                )}
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
                                                            <path d="M 17 3 A 1.50015 1.50015 0 1 0 17 6 C 18.494256 6 20 7.6252653 20 10 C 20 12.374735 18.494256 14 17 14 C 15.505744 14 14 12.374735 14 10 C 14 9.3543874 14.117022 8.7488633 14.318359 8.21875 A 1.50015 1.50015 0 1 0 11.513672 7.1542969 C 11.181009 8.0301835 11 8.9936126 11 10 C 11 13.701265 13.524256 17 17 17 C 20.475744 17 23 13.701265 23 10 C 23 6.2987347 20.475744 3 17 3 z M 31 3 C 27.524256 3 25 6.2987347 25 10 C 25 13.701265 27.524256 17 31 17 A 1.50015 1.50015 0 1 0 31 14 C 29.505744 14 28 12.374735 28 10 C 28 7.6252653 29.505744 6 31 6 C 32.494256 6 34 7.6252653 34 10 C 34 10.82345 33.808539 11.580467 33.496094 12.203125 A 1.5001758 1.5001758 0 1 0 36.177734 13.548828 C 36.705289 12.497486 37 11.28455 37 10 C 37 6.2987347 34.475744 3 31 3 z M 8 16 C 4.7736242 16 2.3566159 18.866029 2.0371094 22.212891 A 1.50015 1.50015 0 1 0 5.0234375 22.498047 C 5.225931 20.376908 6.6123758 19 8 19 C 9.4942555 19 11 20.625265 11 23 C 11 25.374735 9.4942555 27 8 27 C 7.4771264 27 6.994296 26.827346 6.5371094 26.480469 A 1.5006106 1.5006106 0 1 0 4.7226562 28.871094 C 5.6414697 29.568217 6.7828736 30 8 30 C 11.475744 30 14 26.701265 14 23 C 14 19.298735 11.475744 16 8 16 z M 40 16 C 36.524256 16 34 19.298735 34 23 C 34 26.701265 36.524256 30 40 30 C 43.475744 30 46 26.701265 46 23 C 46 21.612536 45.656746 20.30806 45.042969 19.199219 A 1.5001831 1.5001831 0 1 0 42.417969 20.652344 C 42.776191 21.299503 43 22.109464 43 23 C 43 25.374735 41.494256 27 40 27 C 38.505744 27 37 25.374735 37 23 C 37 20.625265 38.505744 19 40 19 A 1.50015 1.50015 0 1 0 40 16 z M 24 19 C 20.790583 19 18.642899 21.429382 17.460938 23.753906 A 1.50015 1.50015 0 1 0 20.134766 25.113281 C 21.052804 23.307805 22.319417 22 24 22 C 25.560111 22 26.724684 23.058996 27.638672 24.640625 C 28.55266 26.222254 29 28.290991 29 29 C 29 29.922188 29.388991 30.756426 29.841797 31.326172 C 30.294603 31.895917 30.780191 32.282068 31.201172 32.658203 C 32.043134 33.410474 32.659418 33.986385 32.910156 35.402344 C 33.169406 36.864135 32.789034 38.252823 32.003906 39.279297 A 1.50015 1.50015 0 1 0 34.386719 41.101562 C 35.683591 39.406036 36.268032 37.161115 35.863281 34.878906 C 35.46502 32.629865 34.138507 31.259151 33.199219 30.419922 C 32.729575 30.000307 32.364054 29.678676 32.189453 29.458984 C 32.014853 29.239292 32 29.202312 32 29 C 32 27.418009 31.44734 25.236246 30.236328 23.140625 C 29.025316 21.045004 26.939889 19 24 19 z M 17.320312 28.292969 A 1.50015 1.50015 0 0 0 15.964844 29.246094 C 15.883494 29.44557 15.289195 29.959033 14.378906 30.826172 C 13.468617 31.693311 12.407056 33.058191 12.101562 35.087891 C 11.423512 39.58947 14.706583 43.90101 19.332031 43.998047 A 1.50015 1.50015 0 0 0 19.333984 43.998047 C 21.105527 44.034437 22.664274 43.333664 23.982422 42.324219 C 25.192725 43.259416 26.60509 43.936307 28.21875 43.994141 A 1.50015 1.50015 0 1 0 28.326172 40.996094 C 27.025602 40.949483 25.908347 40.39754 25.125 39.507812 A 1.50015 1.50015 0 0 0 22.875 39.507812 C 22.036634 40.459995 20.817193 41.029222 19.394531 41 C 16.583979 40.94104 14.636458 38.389577 15.066406 35.535156 C 15.260913 34.242856 15.759555 33.653158 16.447266 32.998047 C 17.134977 32.342936 18.175535 31.76843 18.742188 30.378906 A 1.50015 1.50015 0 0 0 17.320312 28.292969 z" />

                                                        </g>
                                                    </g>
                                                </svg>
                                                {event.address}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between gap-2">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/events/${event.id}`
                                                    )
                                                }
                                                className="w-30 px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                                            >
                                                View Details
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

export default EventsListPage
