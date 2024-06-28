import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Register = ({ onRegisterSuccess }) => {
  const [registerInfo, setRegisterInfo] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleRegisterChange = (e) => {
    setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    // Make a POST request to the register API
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInfo),
    });
    const data = await response.json();
    if (response.ok) {
      // Registration successful, now auto sign-in the user
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerInfo),
      });
      const loginData = await loginResponse.json();
      if (loginResponse.ok) {
        // Save user session to cookies and redirect to /kfm page
        Cookies.set('user', JSON.stringify(loginData.user), { expires: 1 });
        onRegisterSuccess(); // Call the success handler
        router.push('/kmf'); // Redirect to /kfm page
      } else {
        alert('Login after registration failed: ' + loginData.message);
      }
    } else {
      alert('Registration failed: ' + data.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <form onSubmit={handleRegisterSubmit} className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 border-2 border-pink-600">
            <h2 className="mb-4 font-bold text-lg text-pink-600">Register</h2>
            <div className="mb-4">
              <label className="block text-pink-500 text-sm font-bold mb-2" htmlFor="username-register">
                Username
              </label>
              <input 
                className="shadow appearance-none border border-pink-500 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:border-pink-700 bg-black" 
                id="username-register" type="text" name="username" 
                value={registerInfo.username} onChange={handleRegisterChange} 
              />
            </div>
            <div className="mb-6">
              <label className="block text-pink-500 text-sm font-bold mb-2" htmlFor="password-register">
                Password
              </label>
              <input 
                className="shadow appearance-none border border-pink-500 rounded w-full py-2 px-3 text-gray-300 mb-3 leading-tight focus:outline-none focus:border-pink-700 bg-black" 
                id="password-register" type="password" name="password" 
                value={registerInfo.password} onChange={handleRegisterChange} 
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;