import { useState, useEffect } from "react"


const ServicesListPage = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("");


   useEffect(() => {
        fetchServices()
}, [])

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('http://localhost:8000/api/services')

            const data = await response.json()

            if (data.success) {
                setServices(data.data)
            } else {
                setError(data.error || 'Failed to load services')
            }
        } finally {
            setIsLoading(false)
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
    <div className="max-w-4xl mt-20 mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Available Services</h1>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-4">
            {services.map((service) => (
                <li key={service.id} className="p-4 border rounded shadow">
                    <h2 className="text-xl font-semibold">{service.name}</h2>
                    <p>{service.description}</p>
                    <p className="text-gray-500">Price: ${service.price}</p>
                    <p className="text-gray-500">Location: {service.location}</p>
                    <p className="text-gray-500">Contact: {service.contact}</p>
                </li>
            ))}
        </ul>
    </div>
)
};

export default ServicesListPage;

