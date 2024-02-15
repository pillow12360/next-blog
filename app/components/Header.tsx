// app/components/Header.tsx
import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/">
          {/* Tailwind CSS 스타일링을 적용한 <a> 태그 */}
          <div className="hover:text-gray-300 transition-colors duration-200">Home</div>
        </Link>
        <Link href="/about">
          {/* 링크에 스타일링 적용 */}
          <div className="hover:text-gray-300 transition-colors duration-200">About</div>
        </Link>
        <Link href="/posts">
          {/* 링크에 스타일링 적용 */}
          <div className="hover:text-gray-300 transition-colors duration-200">Posts</div>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
