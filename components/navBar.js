// components/Navbar.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <header className="bg-black text-white py-1 shadow-md">
      <nav className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
       
        <ul className="flex space-x-4">
          <li className="hover:text-gray-400">
            <Link href="/admin">Admin</Link>
          </li>
          <li className="hover:text-gray-400">
            <Link href="/account">Account</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
