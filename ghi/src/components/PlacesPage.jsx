import { useState } from 'react';
import PlacesMap from './PlacesMap';

const PlacesPage = () => {
    const [address, setAddress] = useState('');
    const [locations, setLocations] = useState([]);
    const [filters, setFilters] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC but will update

    const filterOptions = [
        { label: 'Pet Shops', value: 'pet.shop' },
        { label: 'Dog Parks', value: 'pet.dog_park' },
        { label: 'Veterinarians', value: 'pet.veterinary' },
        { label: 'Pet Grooming Salons', value: 'pet.service' },
    ];

    const handleFilterChange = (value) => {
        setFilters((prevFilters) =>
            prevFilters.includes(value)
                ? prevFilters.filter((filter) => filter !== value)
                : [...prevFilters, value]
        );
    };

    // Add this new function to your PlacesPage component
const geocodeAddress = async (address) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/api/geocode?address=${encodeURIComponent(address)}`,
        {
            credentials:'include',
        }
    );

    if (!response.ok) {
        throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    if (!data.success) {
        throw new Error(data.error || 'Failed to geocode address');
    }

    return data.data;
};

// Update your existing handleSearch function
const handleSearch = async () => {

    const categories = filters.length > 0 ? filters.join(',') : 'pet';

    if (!address.trim()) {
        setError('Please enter an address.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // First, geocode the address using our backend API
        const coords = await geocodeAddress(address);

        setMapCenter([coords.latitude, coords.longitude]);

        

        const response = await fetch(
            `${import.meta.env.VITE_API_HOST}/api/locations?` +
            `categories=${categories}&` +
            `latitude=${coords.latitude}&` +
            `longitude=${coords.longitude}&` +
            `radius=5000`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch locations.');
        }

        const result = await response.json();
        if (result.success) {
            setLocations(result.data);
        } else {
            setError(result.error || 'An error occurred.');
        }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Search for Pet-Friendly Places
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="col-span-2">
                        <input
                            type="text"
                            placeholder="Enter an address, city, or zip"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                <div className="filter-options mb-4">
                    <h3 className="font-semibold mb-2">Filter by:</h3>
                    <div className="flex flex-wrap gap-4">
                        {filterOptions.map((option) => (
                            <label key={option.value} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={filters.includes(option.value)}
                                    onChange={() => handleFilterChange(option.value)}
                                    className="mr-2"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 p-4 mb-4 bg-red-50 rounded">
                        {error}
                    </div>
                )}

                {locations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <PlacesMap
                                locations={locations}
                                center={mapCenter}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-2">Found Locations</h2>
                            <div className="space-y-2 overflow-y-auto max-h-[500px]">
                                {locations.map((location, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        <strong className="text-green-600">{location.name}</strong>
                                        <p className="text-sm text-gray-600">{location.address}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {location.category.join(', ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacesPage;
