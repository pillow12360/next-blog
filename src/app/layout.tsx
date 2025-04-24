// src/app/layout.tsx
import { Metadata } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

// 메타데이터 설정
export const metadata: Metadata = {
    title: {
        default: "pillow12360",
        template: "%s | 포트폴리오 & 블로그",
    },
    description: "Next.js 15로 구현한 포트폴리오 및 블로그 웹사이트입니다.",
    keywords: ["포트폴리오", "블로그", "개발자", "프론트엔드", "Next.js", "React"],
    authors: [{ name: "pillow12360" }],
    creator: "pillow12360",
};

/**
 * 루트 레이아웃 컴포넌트 - 서버 컴포넌트
 *
 * 애플리케이션의 전체 HTML 구조를 정의합니다.
 * MainLayout 컴포넌트를 포함하여 전체 레이아웃을 구성합니다.
 */
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <body className={GeistSans.className}>
        <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}
