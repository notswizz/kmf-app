import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // Retrieve user data from cookies
    const userData = Cookies.get('user');
    if (userData) {
      const user = JSON.parse(userData);

      // Fetch user points from the getUser.js API
      fetch('../api/getUser', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the user's token
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch user points');
          }
        })
        .then((data) => {
          setUserPoints(data.points);
        })
        .catch((error) => {
          console.error('Error fetching user points:', error);
        });
    }
  }, []);

  return (
    <header className="bg-black text-white py-1 shadow-md">
      <nav className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <p className="text-gray-400">Points: {userPoints}</p>
      </nav>
    </header>
  );
};

export default Navbar;
