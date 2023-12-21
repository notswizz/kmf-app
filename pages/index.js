import React, { useState } from 'react';
import Link from 'next/link';
import Login from '../components/loginForm'; // Adjust the path as necessary
import Register from '../components/registerForm'; // Adjust the path as necessary

const IndexPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
   
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">KMF</h1>
        <div className="text-lg space-y-4">
          <p>
            Explore choices in a playful way with the KMF Game. You'll get sets of three options. 
            Decide who you'd Kill, Marry, or Fuck - it's all about preferences and there are no wrong answers.
          </p>
          
        </div>

        <button 
          onClick={() => setShowLogin(!showLogin)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
        >
          {showLogin ? 'Register' : 'Login'}
        </button>

        {showLogin ? <Login /> : <Register />}
      </div>
    </>
  );
};

export default IndexPage;
