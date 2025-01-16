import { useState } from 'react';
import PlacesMap from './PlacesMap';

const PlacesPage = () => {
    const [address, setAddress] = useState('');
    const [locations, setLocations] = useState([]);
    const [filters, setFilters] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const filerOptions = [
        { label: 'Pet Shops', value: 'pet.shop' },
        { label: 'Dog Parks', value: 'pet.dog_park' },
        { label: 'Veterinarians', value: 'pet.veterinary' },
        { label: 'Pet Grooming Salons', value: 'pet.services' },
    ];

    const handleFilterChange = (value) => {
        setFilters((prevFilters) =>
            prevFilters.includes(value)
                ? prevFilters.filter((filter) => filter !== value)
                : [...prevFilters, value]
        );
    };

    const handleSearch = async () => {
        if (filters.length === 0) {
            setError('Please select at least one filter.');
        }
        setLoading(true);
        setError(null);

        try {

            const categories = filters.join(',');

            const response = await fetch(
                `${import.meta.env.VITE_API_HOST}/api/locations?categories=${categories}&latitude=40.7128&longitude=-74.0060&radius=5000`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch locations.')
            }

            const result = await response.json();
            if (result.success) {
                setLocations(result.data);
            } else {
                setError(result.error || 'An error occurred.')
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
       /* if (!address.trim()) {
            setError('Address cannot be empty.')
            return
        }

        setError(null)
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_HOST
                }/api/locations?latitude=40.7128&longitude=-74.0060&categories=pet.shop&radius=5000`,
                {
                    method: 'GET',
                    headers: {
                        'content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch locations.')
            }

            const data = await response.json()
            setLocations(data.data || [])
        } catch (err) {
            setError(err.message || 'an unexpected error occured.')
        }
    } */

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Search for Pet-Friendly Places
                </h1>
                <div className="flex items-center gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Enter an address, city, or zip"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />

                    <div className="filter-options my-4">
                        <h3>Filter by:</h3>
                        {filterOptions.map((option) => (
                            <label key={option.value} className="block">
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    onChange={() =>
                                        handleFilterChange(option.value)
                                    }
                                    className="mr-2"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Search
                    </button>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {locations.length > 0 && (
                    <div className="results">
                        <h2 className="text-lg font-bold mb-2">Pet-Friendly Locations</h2>
                        <ul className="sp[ace-y-2 mb-8">
                            {locations.map((location, index) => (
                                <li
                                    key={index}
                                    className="p-4 border border-gray-300 rounded"

                                >
                                    <strong>{location.name}</strong>
                                    <br />
                                    {location.address}
                                    <br />
                                    <em>Category: {location.category}</em>
                                </li>
                            ))}
                        </ul>

                        <PlacesMap
                            locations={locations}
                            center={[40.7128, -74.0060]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacesPage
