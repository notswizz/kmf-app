import React from 'react';
import AddPic from '../components/AddPic';
import AddPerson from '../components/AddPerson';

const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1>
      <AddPic />
      <AddPerson />
    </div>
  );
}

export default AdminPage;
