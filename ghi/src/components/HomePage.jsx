import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const HomePage = () => {
    const navigate = useNavigate()
    const [dogFacts, setDogFacts] = useState([])

    useEffect(() => {
        const fetchDogFacts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/dog-facts')
            const data = await response.json()
            if (data.facts) {
                setDogFacts(data.facts)
            }
        } catch (error) {
            console.error('Error fetching dog facts:', error)
        }
    }
    fetchDogFacts()
}, [])

    const handleSpotClick = () => {
            navigate('/places')
    }

    const handleEventClick = () => {
            navigate('/events')
    }

  return (
      <div
          className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-screen bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{ backgroundImage: "url('/backroundDog.jpg')" }}
      >
          <div className="max-w-2xl mx-auto font-sans text-center bg-light-green bg-opacity-75 p-6 rounded-lg">
              <h1 className="text-4xl font-bold text-white mb-4">
                  Discover Dog-Friendly Places Near You
              </h1>

              <p className="text-lg text-white mb-8">
                  Find restaurants, parks, cafes, and more where your dog is
                  welcome
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
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  Random Dog Facts
              </h2>
              <ul className="text-gray-700 text-left">
                  {dogFacts.map((fact, index) => (
                      <li key={index} className="mb-2">
                          • {fact}
                      </li>
                  ))}
              </ul>
          </div>
      </div>
  )
}

export default HomePage
