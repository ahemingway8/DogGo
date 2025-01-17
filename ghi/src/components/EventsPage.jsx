import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthService from "hooks/useAuthService";

const EventsListPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthService();

    useEffect(() => {
        fetchEvents();
    },[]);

    useEffect(() => {
        filteredEvents();
    }, [searchTerm, events]);

    const fetchEvents = async () => {
        try{
            setIsLoading(true);
            const response = await fetch('/api/events');
            const data = await response.json();

            if (data.success) {
                setEvents(data.data);
            } else {
                setError('Failed to load events');
            }
        } catch (err) {
            setError('Failed to fetch Events');
        } finally {
            setIsLoading(false)
        }
    };

    const filterEvents = () => {
        if (!searchTerm) {
            setFilteredEvents(events);
            return;
        }
        const filtered = events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLocaleUpperCase())
        );

        setFilteredEvents(filtered);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center"></div>
        )
    }
}
