import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 shadow-md py-4">
      <nav className="container mx-auto flex justify-between items-center px-6">
        <Link
          href="/"
          className="text-lg font-semibold hover:text-gray-200 transition-colors duration-200 cursor-pointer"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-lg font-semibold hover:text-gray-200 transition-colors duration-200 cursor-pointer"
        >
          About
        </Link>
        <Link
          href="/posts"
          className="text-lg font-semibold hover:text-gray-200 transition-colors duration-200 cursor-pointer"
        >
          Posts
        </Link>
      </nav>
    </header>
  );
};

export default Header;
