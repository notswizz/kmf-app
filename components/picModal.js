import React, { useState } from 'react';

const PicModal = ({ show, onClose, imageUrl, imageId, userPoints, setUserPoints }) => {
  const [purchaseStatus, setPurchaseStatus] = useState('');

  if (!show) {
    return null;
  }

  const handlePurchase = async (pointsCost, platform) => {
    if (userPoints < pointsCost) {
      setPurchaseStatus('Insufficient points');
      return;
    }

    const response = await fetch('/api/purchaseInstagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: 'yourUserId', pointsToDeduct: pointsCost, imageId }),
    });

    if (response.ok) {
      const data = await response.json();
      setUserPoints(data.newPoints);
      setPurchaseStatus(`Purchase successful on ${platform}`);
      if (platform === 'Instagram') {
        window.open(`https://www.instagram.com/${data.instagramHandle}/`, '_blank');
      }
    } else {
      setPurchaseStatus('Purchase failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged Pic" className="w-full object-contain" />
        {purchaseStatus && <p>{purchaseStatus}</p>}
        <button onClick={() => handlePurchase(10000, 'Instagram')} className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded transition ease-in duration-200 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
>
  <div className="flex flex-col items-center">
    <span>Buy Instagram</span>
    <span className="text-sm text-blue-100 mt-1">10,000 points</span>
  </div>
</button>


<button onClick={() => handlePurchase(5000, 'Album')} className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold rounded transition ease-in duration-200 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-purple-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
>
  <div className="flex flex-col items-center">
    <span>Buy Album</span>
    <span className="text-sm text-purple-100 mt-1">5,000 points</span>
  </div>
</button>



      </div>
    </div>
  );
};

export default PicModal;
