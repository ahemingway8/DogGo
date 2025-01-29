import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

const HomePage = () => {
    const navigate = useNavigate()
    const [dogFact, setDogFact] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const factSet = useRef(false)

    useEffect(() => {
        const fetchDogFact = async () => {
            if (factSet.current) return

            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch(
                    'http://localhost:8000/api/dog-facts'
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch dog fact')
                }

                const data = await response.json()
                if (data.fact && !factSet.current) {
                    setDogFact(data.fact)
                    factSet.current = true
                }
            } catch (error) {
                setError(
                    'Failed to load dog fact. Please refresh the page to try again.'
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchDogFact()
    }, [])

    const handleSpotClick = () => {
        navigate('/places')
    }

    const handleEventClick = () => {
        navigate('/events')
    }

   return (
       <div
           className="flex flex-col items-start justify-start h-[calc(100vh-4rem)] w-screen bg-cover bg-center bg-no-repeat overflow-hidden"
           style={{ backgroundImage: "url('/backroundDog.jpg')" }}
       >
           <div className="flex flex-col items-end w-full px-12 mt-60 mr-20 gap-6">
               {' '}
               <div className="max-w-2xl font-sans text-center bg-light-green bg-opacity-75 p-6 rounded-lg">
                   <h1 className="text-4xl font-bold text-white mb-4">
                       Discover Dog-Friendly Places Near You
                   </h1>

                   <p className="text-lg text-white mb-8">
                       Find restaurants, parks, cafes, and more where your dog
                       is welcome
                   </p>

                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                       <button
                           onClick={handleSpotClick}
                           className="px-6 py-3 text-white bg-green rounded-lg hover:bg-dark-green transition-colors"
                       >
                           Find Dog-Friendly Spots
                       </button>

                       <button
                           onClick={handleEventClick}
                           className="px-6 py-3 text-white bg-green rounded-lg hover:bg-dark-green transition-colors"
                       >
                           Find Dog Events
                       </button>
                   </div>
               </div>
               <div className="p-6 bg-green text-white rounded-lg shadow-md max-w-2xl">
                   <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                       Random Dog Fact
                   </h2>
                   {isLoading ? (
                       <p className="text-gray-600">Loading...</p>
                   ) : error ? (
                       <p className="text-red-500">{error}</p>
                   ) : (
                       <p className="text-gray-700">{dogFact}</p>
                   )}
               </div>
           </div>
       </div>
   )



}

export default HomePage
