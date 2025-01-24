import { useNavigate } from 'react-router-dom';
import useAuthService from '../hooks/useAuthService';

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthService();

  const handleSpotClick = () => {
    if (!isLoggedIn) {
      navigate('/places');
    } else {
      navigate('/places');
    }
  };

  const handleEventClick = () => {
    if (!isLoggedIn) {
      navigate('/events');
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-screen bg-cover bg-center bg-no-repeat overflow-hidden"
  style={{ backgroundImage: "url('/backroundDog.jpg')" }}>
    <div className="max-w-2xl mx-auto text-center bg-light-green bg-opacity-75 p-6 rounded-lg">
        <h1 className="text-4xl font-bold text-white mb-4">
          Discover Dog-Friendly Places Near You
        </h1>

        <p className="text-lg text-white mb-8">
          Find restaurants, parks, cafes, and more where your dog is welcome
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
    </div>
  );
};

export default HomePage;
