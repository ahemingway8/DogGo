import useAuthService from '../hooks/useAuthService'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from './toast'

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

const EventDetailPage = () => {
    const { id } = useParams()
    const [event, setEvent] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { showToast, hideToast, Toast } = useToast()
    const { user } = useAuthService()

    useEffect(() => {
        fetchEventDetail()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchEventDetail = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_HOST}/api/events/${id}`, {
                credentials: 'include',
            })
            const data = await response.json()
            if (data.success) {
                setEvent(data.data)
            } else {
                setError(data.error || 'Failed to load event details')
            }
        } catch (err) {
            setError('Failed to fetch event details')
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateTimeStr) => {
        try {
            const date = new Date(dateTimeStr)
            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch (err) {
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

    if (error) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600">{error}</h3>
            </div>
        )
    }

    const handleDelete = () => {
        showToast({
            message: 'Are you sure you want to delete this event?',
            showConfirm: true,
            onConfirm: confirmDelete,
        })
    }

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/events/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            const data = await response.json()
            if (data.success) {
                hideToast()
                navigate('/events')
            } else {
                setError(data.error || 'Failed to delete event')
            }
        } catch (err) {
            setError('Failed to delete event')
        }
    }

    const canModifyEvent = user && event && event.created_by === user.id

    return (
        <>
            {Toast}
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
            <div className="max-w-6xl mx-auto px-4 py-6 bg-white/20 backdrop-blur-sm rounded-lg">
                <div className="mb-8 rounded-lg p-4">
                    <div className="flex justify-center items-center mb-6">
                        <h1 className="text-4xl font-bold text-black mt-4">
                            {event?.name}
                        </h1>
                    </div>

                    {event.picture_url ? (
                        <div className="max-w-md mx-auto h-auto mb-6 rounded-lg">
                            <img
                                src={event.picture_url}
                                alt={event.name}
                                className="w-full h-auto object-contain rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto h-80 bg-light-green mb-6 flex justify-center items-center rounded-lg">
                            <span className="text-white">No image available</span>
                        </div>
                    )}

                    <div className="bg-light-green rounded-lg shadow-md border border-light-green p-6">
                        <div className="mb-4">
                            <h3 className="text-3xl font-semibold text-white">
                                Event Details
                            </h3>
                        </div>
                        <div className="text-xl font-normal text-white space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 flex items-center justify-center mr-2">
                                    <svg
                                        className="h-6 w-6"
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
                                </div>
                                <span>{formatDate(event.date_time)}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 flex items-center justify-center mr-2">
                                    <svg
                                        className="h-8 w-8"
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
                                </div>
                                {event.address}
                            </div>
                            <p className="mb-4">
                                <span className="font-normal">Description: </span>
                                {event.description}
                            </p>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => navigate('/events')}
                                className="text-lg px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                            >
                                Back to Events List
                            </button>
                            {canModifyEvent && (
                                <>
                                    <button
                                        onClick={() =>
                                            navigate(`/events/edit/${id}`)
                                        }
                                        className="text-lg px-4 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-lg px-4 py-2 bg-red text-white rounded-lg hover:bg-dark-red transition-colors"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventDetailPage
