// app/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-700 text-white py-4 mt-8"> {/* 배경색, 텍스트 색상, 패딩, 마진 적용 */}
      <div className="container mx-auto text-center"> {/* 가운데 정렬 */}
        <p>© 2024 My Personal Blog</p>
      </div>
    </footer>
  );
}

export default Footer;
