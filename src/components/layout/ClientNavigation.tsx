"use client";

// src/components/layout/ClientNavigation.tsx
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Sun, Moon, Home, User, Briefcase, Newspaper, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MobileMenu } from "./MobileMenu";
import {signIn, signOut, useSession} from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


/**
 * 네비게이션 컴포넌트 - 클라이언트 컴포넌트
 *
 * 기능:
 * - 현재 페이지 하이라이팅
 * - 모바일 메뉴 토글
 * - 다크모드 토글
 * - 모션 애니메이션
 */
export function ClientNavigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const loginHandler = () => {
        signIn();
    }
     const  logoutHandler =  () => {
        signOut();
    }
    const { data: session, status } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";
    // 네비게이션 항목 정의
    const navItems = [
        { name: "홈", href: "/", icon: Home },
        { name: "소개", href: "/about", icon: User },
        { name: "포트폴리오", href: "/portfolio", icon: Briefcase },
        { name: "블로그", href: "/blog", icon: Newspaper },
        { name: "연락처", href: "/contact", icon: Mail },
    ];
    const router = useRouter(); // 추가: router 정의

    const handleLoginClick = () => {
        router.push("/login");
    };

    return (
        <div className="flex w-full items-center justify-between">
            {/* 로고 */}
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                >
                    pillow12360's Portfolio
                </motion.div>
            </Link>

            {/* 데스크탑 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-6 mx-6">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative px-1 py-2 text-sm font-medium transition-colors hover:text-primary",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <span>{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="navigation-underline"
                                    className="absolute -bottom-px left-0 right-0 h-[2px] bg-primary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="flex items-center">
                {/* 다크모드 토글 */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="mr-2"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">테마 변경</span>
                </Button>

                {status === "authenticated" ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-8 w-8 cursor-pointer">
                                <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? "사용자"} />
                                <AvatarFallback>
                                    {session.user?.name?.charAt(0) ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuLabel>{isAdmin === true ? "관리자 " : "방문자 "}{session.user?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="..." scroll={false}>프로필</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => signOut()}>
                                로그아웃
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button onClick={handleLoginClick}>
                        로그인
                    </Button>
                )}

                {/* 모바일 메뉴 토글 버튼 */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                    <span className="sr-only">메뉴</span>
                </Button>
            </div>

            {/* 모바일 메뉴 */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                navItems={navItems}
            />
        </div>
    );
}
