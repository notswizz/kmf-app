import React, { useState } from 'react';
import AddPic from '../components/addPic';
import AddPerson from '../components/addPerson';
import PersonDisplay from '@/components/displayPeople';

const AdminPage = () => {
  const [showAddPerson, setShowAddPerson] = useState(true);

  const toggleForm = () => {
    setShowAddPerson(!showAddPerson);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleForm}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {showAddPerson ? 'Switch to Add Image' : 'Switch to Add Person'}
        </button>
      </div>
      {showAddPerson ? <AddPerson /> : <AddPic />}
      <PersonDisplay />
    </div>
  );
}

export default AdminPage;