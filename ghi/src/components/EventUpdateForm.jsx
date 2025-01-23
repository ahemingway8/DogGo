import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthService from "../hooks/useAuthService";


const API_HOST = import.meta.env.VITE_API_HOST;

if (!API_HOST) {
    throw new Error("VITE_API_HOST is not defined");
}

const EventsEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuthService();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        date_time: "",
        picture_url: "",
        created_by: null
    });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/signin");
            return;
        }
        if (id) {
            fetchEvent();
        }
        }, [id, isLoggedIn]);

        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_HOST}/api/events/${id}`, {
                    credentials: "include"
                });
                const data = await response.json()

                if(data.success) {
                    const event = data.data;
                    if (event.created_by !== user?.id) {
                        setError("You don't have permission to edit this event");
                        navigate('/events');
                        return;
                    }
                    const formattedDateTime = new Date(event.date_time)
                        .toISOString()
                        .slice(0, 16);

                    setFormData({
                        name: event.name,
                        description: event.description,
                        address: event.address,
                        date_time: formattedDateTime,
                        picture_url: event.picture_url || "",
                        created_by: event.created_by
                    });
                } else {
                    setError(data.error || "Failed to load event");
                    navigate("/events");
                }
            } catch (err) {
                setError("Failed to fetch event");
                console.error(err);
                navigate("/events");
            } finally {
                setIsLoading(false);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError(null);

            if(!user || formData.created_by !== user.id) {
                setError("You don't have permission to edit this event");
                return;
            }

            try {
                const response = await fetch(`${API_HOST}/api/events/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        ...formData,
                        date_time: new Date(formData.date_time).toISOString(),
                        picture_url: formData.picture_url || null,
                        created_by: user.id
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    navigate("/events");
                } else {
                    setError(data.error || "Failed to update event");
                }
            } catch (err) {
                setError("Failed to update event");
                console.error(err);
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
                    <h1 className="text-3xl font-bold text-black">
                        Edit Event
                    </h1>
                    <button
                        onClick={() => navigate("/events")}
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
                                Event name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData,
                                    name: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData,
                                    description: e.target.value })}
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                rows="3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">
                                Date/Time
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.date_time}
                                onChange={(e) => setFormData({ ...formData,
                                    date_time: e.target.value })}
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
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
                                onChange={(e) => setFormData({ ...formData,
                                    address: e.target.value })}
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
                                value={formData.picture_url || ""}
                                onChange={(e) => setFormData({ ...formData,
                                    picture_url: e.target.value })}
                                className="w-full p-2 border border-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                                placeholder="url('../public/doggo-event-placeholder.jpg')"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-green text-white rounded-lg hover:bg-dark-green transition-colors"
                        >
                            Update Event
                        </button>
                    </div>
                </form>
            </div>
        );
};

export default EventsEditForm;
