import React from 'react';
import Link from 'next/link';

const UserModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-4/5 md:w-1/3">
        
        
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-green-600 mb-2">For Players</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">Earn points by swiping.</li>
            <li className="mb-2">Buy more content with points.</li>
           
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-pink-600 mb-2">For Models</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">Upload photos for monthly payout via Venmo or Cash App.</li>
          
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserModal;
