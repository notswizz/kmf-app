import React from 'react';
import AddPic from '../components/addPic';
import AddPerson from '../components/addPerson';


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
