import { useState } from 'react'

const PlacesPage = () => {
    const [address, setAddress] = useState('')
    const [locations, setLocations] = useState([])
    const [error, setError] = useState(null)

    const handleSearch = async () => {
        if (!address.trim()) {
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
    }

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
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    ></button>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {locations.length > 0 && (
                    <>
                        <h2 className="text-lg font-bold mb-2">List View</h2>
                        <ul className="sp[ace-y-2 mb-8">
                            {locations.map((location, index) => (
                                <li
                                    key={index}
                                    className="p-4 border border-gray-300 rounded"
                                >
                                    <h3 className="font-bold text-gray-800">
                                        {location.name || 'Unnamed'}
                                    </h3>
                                    <p className="text-gray-600">
                                        {location.address}
                                    </p>
                                    <p className="test-gray-500 text-sm">
                                        Distance: {location.distance || 'N/A'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {/*Ploaceholder for map */}
                {locations.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-2">Map View</h2>
                        <div className="w-full h-96 bg-gray-200">
                            {/* Implememnt Map rendering logic here */}
                            <p className="text-center text-gray-500 py-20">
                                Interactive map coming soon
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PlacesPage
