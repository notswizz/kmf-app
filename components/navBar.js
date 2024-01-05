import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const NavBar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        const user = JSON.parse(userCookie);
        try {
          const response = await fetch(`/api/getUser?username=${user.username}`);
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">KMF Game</div>
        {userData && (
          <div className="flex items-center space-x-4">
               <span>{userData.points} points</span>
            <span>{userData.username}</span>
         
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
