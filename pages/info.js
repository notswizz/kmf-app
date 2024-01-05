// pages/info.js

import React, { useState } from 'react';

const InfoPage = () => {
  const [showModelsInfo, setShowModelsInfo] = useState(false);
  const [showPlayersInfo, setShowPlayersInfo] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <img src="/KMF.png" alt="KMF Logo" className="mx-auto" style={{ maxHeight: '150px' }} />
        <h1 className="text-4xl font-bold my-4">KMF Information</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-around items-start md:items-stretch my-8">
        {/* Models Section */}
        <div className="flex-1 mx-2 mb-4 md:mb-0">
          <button 
            className="text-3xl font-bold text-center mb-3 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => setShowModelsInfo(!showModelsInfo)}
          >
            Models
          </button>
          {showModelsInfo && (
            <div className="text-lg p-4 border border-gray-200 rounded mt-2 bg-gray-100">
  <h3 className="text-xl font-semibold mb-2">How It Works:</h3>
  <ul className="list-disc list-inside">
    <li>Submit a collection of 10-15  photos to be featured in the KMF cycle.</li>
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
            className="text-3xl font-bold text-center mb-3 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
            onClick={() => setShowPlayersInfo(!showPlayersInfo)}
          >
            Players
          </button>
          {showPlayersInfo && (
            <div className="text-lg p-4 border border-gray-200 rounded mt-2 bg-gray-100">
  <h3 className="text-xl font-semibold mb-2">How It Works:</h3>
  <ul className="list-disc list-inside">
    <li>Engage with a series of three pictures featuring three different models.</li>
    <li>Make your choices: decide whom you'd hypothetically Fuck, Kill or Marry.</li>
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
</div>
);
};

export default InfoPage;