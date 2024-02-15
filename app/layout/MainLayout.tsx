// app/layout/MainLayout.tsx
import React, { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto my-8"> {/* 가운데 정렬, 상하 마진 적용 */}
        {children}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
