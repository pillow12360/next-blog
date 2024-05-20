import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      {/* 배경색을 더 어둡게 조정하고, 패딩을 조금 늘렸으며, 마진 상단을 조금 더 추가 */}
      <div className="container mx-auto text-center">
        {/* 컨테이너를 가운데 정렬 */}
        <p className="text-sm font-light">
          © 2024 pillow12360 Blog. All rights reserved.
        </p>
        {/* 글꼴 크기 및 두께 조정 */}
      </div>
    </footer>
  );
};

export default Footer;
