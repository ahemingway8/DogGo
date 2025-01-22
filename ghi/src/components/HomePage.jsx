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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-black mb-4">
          Discover Dog-Friendly Places Near You
        </h1>

        <p className="text-lg text-black mb-8">
          Find restaurants, parks, cafes, and more where your dog is welcome
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSpotClick}
            className="px-6 py-3 text-black bg-tan rounded-lg hover:bg-dark-tan transition-colors"
          >
            Find Dog-Friendly Spots
          </button>

          <button
            onClick={handleEventClick}
            className="px-6 py-3 text-black bg-tan rounded-lg hover:bg-dark-tan transition-colors"
          >
            Find Dog Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
