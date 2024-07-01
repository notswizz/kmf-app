import React from 'react';
import Cookies from 'js-cookie';

const Submit = ({ selections, setSelections, setShowImages, setShowSubmitButton, setIsLoading, setShowPointsDisplay, setUserPoints, fetchImages, updatePoints, isLoading, setImages }) => {
  const handleSubmit = async () => {
    setIsLoading(true);
    const uniqueSelections = new Set(Object.values(selections));
    if (uniqueSelections.size === 3) {
      try {
        const userCookie = Cookies.get('user');
        const user = userCookie ? JSON.parse(userCookie) : null;

        const submitResponse = await fetch('/api/kmfApi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user ? user._id : null,
            selections: selections
          }),
        });

        if (submitResponse.ok) {
          setShowImages(false);
          setShowSubmitButton(false);

          if (user) {
            const pointsResponse = await fetch('/api/addPoint', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id })
            });

            if (pointsResponse.ok) {
              await updatePoints();
              setShowPointsDisplay(true);

              const userResponse = await fetch(`/api/getUser?username=${encodeURIComponent(user.username)}`);
              if (userResponse.ok) {
                const updatedUserData = await userResponse.json();
                Cookies.set('user', JSON.stringify(updatedUserData), { expires: 1 });

                setUserPoints(updatedUserData.points);
                setShowPointsDisplay(true);

                setImages([]);
                await fetchImages();

                setTimeout(() => {
                  setShowPointsDisplay(false);
                  setShowImages(true);
                  setShowSubmitButton(true);
                  setIsLoading(false);
                }, 1000);
              } else {
                console.error('Failed to fetch updated user data');
              }
            } else {
              console.error('Failed to update points');
            }
          } else {
            setShowPointsDisplay(true);
            setTimeout(async () => {
              setShowPointsDisplay(false);
              setShowImages(true);
              setShowSubmitButton(true);
              setIsLoading(false);
              setImages([]);
              await fetchImages();
            }, 1000);
          }

          setSelections({ kiss: null, marry: null, fade: null });
        } else {
          console.error('Submission failed');
        }
      } catch (error) {
        console.error('Error during submission:', error);
      }
    } else {
      console.error('Please make a unique selection for each category');
    }
  };

  return (
    <div className="text-center mt-8">
      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Submitting...
          </div>
        ) : (
          'Submit'
        )}
      </button>
    </div>
  );
};

export default Submit;