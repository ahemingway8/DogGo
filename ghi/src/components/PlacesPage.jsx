import { useState, useRef } from 'react'
import PlacesMap from './PlacesMap'
import { debounce } from 'lodash';

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
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <PawPrint className="absolute z-[-1] -rotate-45 top-12 left-12 text-dark-tan opacity-90 scale-75" />
                <PawPrint className="absolute z-[-2] -rotate-12 top-24 left-1/4 text-dark-tan opacity-40" />
                <PawPrint className="absolute z-[-3] rotate-45 top-16 right-1/3 text-dark-tan opacity-60 scale-90" />
                <PawPrint className="absolute z-[-4] -rotate-90 top-8 right-24 text-dark-tan opacity-80 scale-75" />

                <PawPrint className="absolute z-[-5] rotate-12 top-1/3 left-36 text-dark-tan opacity-35 scale-110" />
                <PawPrint className="absolute z-[-6] -rotate-30 top-1/2 left-1/4 text-dark-tan opacity-100" />
                <PawPrint className="absolute z-[-7] rotate-60 top-1/2 right-1/4 text-dark-tan opacity-50" />
                <PawPrint className="absolute z-[-8] -rotate-15 top-1/3 right-36 text-dark-tan opacity-30 scale-90" />

                <PawPrint className="absolute z-[-9] rotate-90 bottom-24 left-24 text-dark-tan opacity-85 scale-75" />
                <PawPrint className="absolute z-[-10] rotate-45 bottom-36 left-1/3 text-dark-tan opacity-70" />
                <PawPrint className="absolute z-[-11] -rotate-45 bottom-48 right-1/3 text-dark-tan opacity-85 scale-110" />
                <PawPrint className="absolute z-[-12] rotate-180 bottom-24 right-24 text-dark-tan opacity-45 scale-75" />

                <PawPrint className="absolute z-[-13] rotate-15 top-1/2 left-1/2 text-dark-tan opacity-90 scale-125" />
                <PawPrint className="absolute z-[-14] -rotate-75 bottom-1/3 left-1/2 text-dark-tan opacity-55 scale-90" />
                <PawPrint className="absolute z-[-15] rotate-30 top-2/3 right-1/2 text-dark-tan opacity-35 scale-100" />
            </div>
            <div className="min-h-screen p-4 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl text-center font-bold text-black mb-4 mt-7 border-transparent p-2">
                        Search for Pet-Friendly Places
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2 relative z-[1]">
                        <PlacesMap
                            locations={locations}
                            center={mapCenter}
                        />
                    </div>
                    <div>
                        <h2 className="text-lg text-black font-bold mb-2">
                            Found Locations
                        </h2>
                        <div className="space-y-2 overflow-y-auto max-h-[500px] z-0">
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
