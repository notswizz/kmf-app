import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Login = ({ onLoginSuccess }) => {
  const [loginInfo, setLoginInfo] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleLoginChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginInfo),
    });
    const data = await response.json();

    if (response.ok) {
      // Log the ObjectId to the console
      console.log('User ObjectId:', data.user._id);
      // Set the user data in cookies
      Cookies.set('user', JSON.stringify(data.user), { expires: 1 }); // data.user should contain _id now
      
      // Fetch and store the user's points from the getperson.js API
      const pointsResponse = await fetch('../api/getUser', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${data.token}` }, // Include the user's token
      });

      if (pointsResponse.ok) {
        const pointsData = await pointsResponse.json();
        const updatedUser = { ...data.user, points: pointsData.points };
        Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });
      } else {
        console.error('Failed to fetch user points:', pointsResponse.statusText);
      }

      onLoginSuccess(); // Call the success handler
      router.push('/kmf'); // Redirect to kmf.js page
    } else {
      alert('Login failed: ' + data.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <form onSubmit={handleLoginSubmit} className=          "bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border-2 border-pink-600">
            <h2 className="mb-4 font-bold text-lg text-pink-600">Login</h2>
            <div className="mb-4">
              <label className="block text-pink-500 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input 
                className="shadow appearance-none border border-pink-500 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:border-pink-700 bg-black" 
                id="username" type="text" name="username" 
                value={loginInfo.username} onChange={handleLoginChange} 
              />
            </div>
            <div className="mb-6">
              <label className="block text-pink-500 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input 
                className="shadow appearance-none border border-pink-500 rounded w-full py-2 px-3 text-gray-300 mb-3 leading-tight focus:outline-none focus:border-pink-700 bg-black" 
                id="password" type="password" name="password" 
                value={loginInfo.password} onChange={handleLoginChange} 
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;