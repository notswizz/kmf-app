import React, { useState } from 'react';

const AddPerson = () => {
  const [person, setPerson] = useState({
    name: '',
    age: '',
    boobs: '',
    booty: '',
    hairColor: ''
  });

  const handleChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(person);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={person.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
        <input
          type="number"
          name="age"
          value={person.age}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>
      {/* Additional fields for boobs, booty, and hair color */}
      {/* ... */}
      
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </form>
  );
};

export default AddPerson;
