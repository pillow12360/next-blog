import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // 이미지 도메인 설정
    images: {
        domains: [
            'images.unsplash.com',     // Unsplash 이미지 허용
            'picsum.photos',           // Lorem Picsum (필요한 경우)
            'lh3.googleusercontent.com', // Google 사용자 프로필 이미지 (OAuth 로그인 시 필요)
            'avatars.githubusercontent.com', // GitHub 프로필 이미지 (필요한 경우)
            'api.dicebear.com',        // DiceBear API (아바타 생성 서비스)
        ],
        // 또는 더 안전한 방식으로 패턴 설정
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                port: '',
                pathname: '/**',
            },
        ],
    },

    // 기타 Next.js 설정
    reactStrictMode: true,
    swcMinify: true,
};

export default nextConfig;
