import { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from Next.js

const Register = () => {
  const [registerInfo, setRegisterInfo] = useState({ username: '', password: '' });
  const router = useRouter(); // Initialize the router

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
      alert('Registration successful');
      Cookies.set('user', JSON.stringify(data.user), { expires: 1 }); // data.user should contain _id now
      // Redirect to the kmf.js page after successful registration
      router.push('/kmf');
    } else {
      alert('Registration failed: ' + data.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <form onSubmit={handleRegisterSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="mb-4 font-bold text-lg">Register</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username-register">
                Username
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username-register" type="text" name="username" value={registerInfo.username} onChange={handleRegisterChange} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-register">
                Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password-register" type="password" name="password" value={registerInfo.password} onChange={handleRegisterChange} />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
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
