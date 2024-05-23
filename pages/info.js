import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const InfoPage = () => {
  const router = useRouter();
  const [showModelsInfo, setShowModelsInfo] = useState(false);
  const [showPlayersInfo, setShowPlayersInfo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [totalPeople, setTotalPeople] = useState(null);
  const [totalImages, setTotalImages] = useState(null);
  const [totalPoints, setTotalPoints] = useState(null);

  useEffect(() => {
    const fetchTotalPeople = async () => {
      const response = await fetch('/api/getPerson');
      if (response.ok) {
        const data = await response.json();
        setTotalPeople(data.length);
      }
    };

    const fetchTotalImages = async () => {
      const response = await fetch('/api/download');
      if (response.ok) {
        const data = await response.json();
        setTotalImages(data.images.length);
      } else {
        console.error('Failed to fetch images:', response.statusText);
        setTotalImages('Failed to load images');
      }
    };

    const fetchTotalPoints = async () => {
      const response = await fetch('/api/getTotalPoints');
      if (response.ok) {
        const data = await response.json();
        setTotalPoints(data.totalPoints);
      } else {
        console.error('Failed to fetch total points:', response.statusText);
        setTotalPoints('Failed to load total points');
      }
    };



    fetchTotalPeople();
    fetchTotalImages();
    fetchTotalPoints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="text-center">
        <img src="/KMF.png" alt="KMF Logo" className="mx-auto" style={{ maxHeight: '150px' }} />
        <h1 className="text-4xl font-bold my-4">KMF Information</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-around items-start md:items-stretch my-8 space-y-4 md:space-y-0">
        {/* Models Section */}
        <div className="flex-1 mx-2">
          <button
            className="text-3xl font-bold text-center mb-3 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
            onClick={() => setShowModelsInfo(!showModelsInfo)}
          >
            Models
          </button>
          {showModelsInfo && (
            <div className="text-lg p-4 border border-gray-700 rounded-lg mt-2 bg-gray-800 shadow-xl">
              <h3 className="text-xl font-semibold mb-2">How It Works:</h3>
              <ul className="list-disc list-inside">
                <li>Submit a collection of 10-15 photos to be featured in the KMF cycle.</li>
                <li>Every swipe on your photo by players enhances your rating—every interaction counts!</li>
                <li>You're guaranteed payment regardless of the swipe results, ensuring fair earnings.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Earnings and Payments:</h3>
              <ul className="list-disc list-inside">
                <li>Earnings are distributed the first Friday of each month.</li>
                <li>Receive your payments safely via Venmo or Cash App.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Revenue Model:</h3>
              <ul className="list-disc list-inside">
                <li>Players support the platform by paying to access exclusive content like Instagram or OnlyFans pages of their favorite models.</li>
                <li>This model enables us to compensate our models generously and consistently.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Players Section */}
        <div className="flex-1 mx-2">
          <button
            className="text-3xl font-bold text-center mb-3 w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg"
            onClick={() => setShowPlayersInfo(!showPlayersInfo)}
          >
            Players
          </button>
          {showPlayersInfo && (
            <div className="text-lg p-4 border border-gray-700 rounded-lg mt-2 bg-gray-800 shadow-xl">
              <h3 className="text-xl font-semibold mb-2">How It Works:</h3>
              <ul className="list-disc list-inside">
                <li>Engage with a series of three pictures featuring three different models.</li>
                <li>Make your choices: decide whom you'd hypothetically Kiss, Marry, or Fade.</li>
                <li>Each choice rewards you with points.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Rewards and Incentives:</h3>
              <ul className="list-disc list-inside">
                <li>Accumulate points to unlock exclusive content and access within the app.</li>
                <li>Future updates will include opportunities for point redemption for earnings.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Supporting the Platform:</h3>
              <ul className="list-disc list-inside">
                <li>Your participation and engagement directly contribute to the vibrancy of the platform.</li>
                <li>Optional purchases within the app help sustain the model, ensuring continuous improvement and rewards.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1 mx-2">
        <button
          className="text-3xl font-bold text-center mb-3 w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-lg"
          onClick={() => setShowStats(!showStats)}
        >
          Stats
        </button>
        {showStats && (
          <div className="bg-gray-800 p-6 border border-gray-700 rounded-lg mt-3 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">Total Models:</h3>
            <p className="text-xl mb-5">{totalPeople !== null ? totalPeople : 'Loading...'}</p>
            <h3 className="text-2xl font-semibold mb-4">Total Images:</h3>
            <p className="text-xl mb-5">{totalImages !== null ? totalImages : 'Loading...'}</p>
            <h3 className="text-2xl font-semibold mb-4">Total Ratings:</h3>
            <p className="text-xl">{totalPoints !== null ? totalPoints : 'Loading...'}</p>
          </div>
        )}
        <button onClick={() => router.push('/')} className="text-3xl font-bold text-center mb-3 w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition duration-300 shadow-lg">Home</button>

      </div>
    </div>
  );
};

export default InfoPage;
