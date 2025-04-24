// src/components/layout/MainLayout.tsx
import { ClientNavigation } from "./ClientNavigation";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";
import { ThemeProvider } from "./ThemeProvider";

interface MainLayoutProps {
    children: React.ReactNode;
}

/**
 * 메인 레이아웃 컴포넌트 - 서버 컴포넌트
 *
 * 전체 애플리케이션의 구조를 정의합니다:
 * - 상단 네비게이션 바
 * - 메인 콘텐츠 영역
 * - 하단 푸터
 */
export function MainLayout({ children }: MainLayoutProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
        >
            <div className="flex min-h-screen flex-col bg-background text-foreground w-full">
                <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container w-full mx-auto flex h-16 items-center">
                        <ClientNavigation />
                    </div>
                </header>

                <PageTransition>
                    <main className="flex-1 w-full">
                        <div className="container w-full mx-auto px-4">
                            {children}
                        </div>
                    </main>
                </PageTransition>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
