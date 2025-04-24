// src/app/layout.tsx
import { Metadata } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

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

export default function RootLayout({
                                       children,
    modal
                                   }: {
    children: React.ReactNode,
    modal : React.ReactNode
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <body className={GeistSans.className}>
        <SessionProvider>
            <MainLayout>
                {children}
            </MainLayout>
            {modal}
        </SessionProvider>
        </body>
        </html>
    );
}
