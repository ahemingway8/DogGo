import { useState, useRef } from 'react'
import PlacesMap from '../components/PlacesMap'
import { debounce } from 'lodash';


const PlacesPage = () => {
    const [address, setAddress] = useState('')
    const [locations, setLocations] = useState([])
    const [filters, setFilters] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [mapCenter, setMapCenter] = useState([40.7128, -74.006])
    const [suggestions, setSuggestions] = useState([])
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const searchContainerRef = useRef(null)

    const handleFilterMouseEnter = () => setShowFilterDropdown(true);
    const handleFilterMouseLeave = () => {
        setTimeout(() => {
            if (!document.querySelector('.filter-dropdown:hover')) {
                setShowFilterDropdown(false)
            }
        }, 100)
    }

    const filterOptions = [
        { label: 'Pet Shops', value: 'pet.shop' },
        { label: 'Dog Parks', value: 'pet.dog_park' },
        { label: 'Veterinarians', value: 'pet.veterinary' },
        { label: 'Pet Grooming Salons', value: 'pet.service' },
    ]

    const handleGlobalClick = (e) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
            setSuggestions([]);
        }
    };

    const handleFilterChange = (value) => {
        setFilters((prevFilters) =>
            prevFilters.includes(value)
                ? prevFilters.filter((filter) => filter !== value)
                : [...prevFilters, value]
        )
    }

    const geocodeAddress = async (address) => {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_HOST
            }/api/geocode?address=${encodeURIComponent(address)}`,
            {
                credentials: 'include',
            }
        )

        if (!response.ok) {
            throw new Error('Failed to geocode address')
        }

        const data = await response.json()
        if (!data.success) {
            throw new Error(data.error || 'Failed to geocode address')
        }

        return data.data
    }

    const handleSearch = async (selectedAddress = address) => {
        const categories = filters.length > 0 ? filters.join(',') : 'pet'

        if (!selectedAddress.trim()) {
            setError('Please enter an address.')
            return;
        }

        setLoading(true)
        setError(null)

        try {
            const coords = await geocodeAddress(selectedAddress)

            setMapCenter([coords.latitude, coords.longitude])

            const response = await fetch(
                `${import.meta.env.VITE_API_HOST}/api/locations?` +
                    `categories=${categories}&` +
                    `latitude=${coords.latitude}&` +
                    `longitude=${coords.longitude}&` +
                    `radius=5000`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch locations.')
            }

            const result = await response.json()
            if (result.success) {
                setLocations(result.data)
            } else {
                setError(result.error || 'An error occurred.')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const debouncedFetchSuggestions = debounce(async (query) => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_HOST}/api/autocomplete?query=${encodeURIComponent(query)}`
            )

            if (!response.ok) throw new Error('Failed to fetch suggestions')

            const data = await response.json()
            if (data?.success && Array.isArray(data.data)) {
                setSuggestions(data.data)
            } else {
                setSuggestions([])
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error)
            setSuggestions([])
        }
    }, 300)

    const handleInputChange = (e) => {
        setAddress(e.target.value)
        debouncedFetchSuggestions(e.target.value)
    }

    return (
        <div onClick={handleGlobalClick}>
            <div className="min-h-screen p-4">
                <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-sm">
                    <h1 className="text-4xl text-center font-bold text-black mb-4 mt-7 border-transparent p-2">
                        Search for Pet-Friendly Places
                    </h1>

                    <div className="max-w-3xl mx-auto mb-6">
                        <div className="col-span-2">
                            <div className="flex" ref={searchContainerRef} onClick={(e) => e.stopPropagation()} >
                                <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        handleInputChange(e);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            setSuggestions([]);
                                            handleSearch(address);
                                        }
                                    }}
                                    placeholder="Enter an address"
                                     className="w-full p-2 border-l border-t border-b border-green rounded-l focus:ring-2 focus:ring-white focus:border-transparent"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="absolute w-full bg-white border border-green rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                                        {suggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray cursor-pointer border-b border-green last:border-b-0 text-black"
                                                onClick={async () => {
                                                    setSuggestions([])
                                                    setAddress(suggestion.address || '')
                                                    setMapCenter([
                                                        suggestion.latitude,
                                                        suggestion.longitude,
                                                    ]);
                                                    await handleSearch(suggestion.address);
                                                }}
                                            >
                                                {suggestion.address}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            <div
                                className="relative"
                                onMouseEnter={handleFilterMouseEnter}
                                onMouseLeave={handleFilterMouseLeave}
                            >
                                <button
                                    className="h-full px-4 border text-white border-light-green bg-light-green hover:bg-green"
                                >
                                    <span className="mr-2">Filter By</span>
                                    <span className={`transform transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {showFilterDropdown && (
                                    <div
                                        className="filter-dropdown absolute right-0 mt-1 w-64 bg-light-green text-white border border-light-green rounded-md shadow-lg z-50"
                                        onMouseLeave={handleFilterMouseLeave}
                                    >
                                        <div className="p-3">
                                            <div className="font-semibold mb-2">Filter by type: </div>
                                            {filterOptions.map((option) => (
                                                <label key={option.value} className="flex items-center py-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.includes(option.value)}
                                                        onChange={() => handleFilterChange(option.value)}
                                                        className="mr-2"
                                                    />
                                                    <span>{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleSearch(address)}
                                className="px-4 py-2 bg-green text-white rounded hover:bg-dark-green transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-black p-4 mb-4 bg-red rounded">
                        {error}
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <div className="w-full mb-6 relative z-[1]">
                        <PlacesMap
                            locations={locations}
                            center={mapCenter}
                        />
                    </div>
                    <div>
                        <h2 className="text-lg text-black font-bold mb-2">
                            Found Locations
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {locations.length > 0 ? (
                                locations.map((location, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border border-light-green rounded bg-light-green"
                                    >
                                        <strong className="text-white">
                                            {location.name}
                                        </strong>
                                        <p className="text-sm text-white">
                                            {location.address}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">
                                    Search to find locations
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default PlacesPage
