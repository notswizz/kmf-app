import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Navbar = ({ updatePoints }) => {
  const [username, setUsername] = useState('');
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);

      // Call updatePoints if defined
      if (updatePoints) {
        updatePoints().then((points) => setUserPoints(points));
      } else {
        // Fetch user points from the getUser.js API
        fetch(`/api/getUser?username=${encodeURIComponent(user.username)}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to fetch user data');
            }
          })
          .then((data) => {
            setUserPoints(data.points);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    }
  }, [updatePoints]);

  return (
    <header className="bg-black text-white py-1 shadow-md">
      <nav className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <p className="text-gray-400">{username ? ` ${username}` : 'Not Logged In'}</p>
        <p className="text-gray-400">Points: {userPoints}</p>
      </nav>
    </header>
  );
};

export default Navbar;
