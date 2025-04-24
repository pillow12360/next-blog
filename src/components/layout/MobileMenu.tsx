"use client";

// src/components/layout/MobileMenu.tsx
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: NavItem[];
}

/**
 * 모바일 메뉴 컴포넌트 - 클라이언트 컴포넌트
 *
 * 기능:
 * - 스무스한 오픈/클로즈 애니메이션
 * - 현재 페이지 하이라이트
 * - 터치 제스처 지원
 */
export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
    const pathname = usePathname();

    // 애니메이션 변수
    const menuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                type: "tween",
                duration: 0.3,
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "tween",
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        closed: { opacity: 0, x: 20 },
        open: { opacity: 1, x: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 배경 오버레이 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                        onClick={onClose}
                    />

                    {/* 메뉴 패널 */}
                    <motion.div
                        className="fixed top-16 right-0 bottom-0 z-50 w-3/4 max-w-xs bg-background border-l md:hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <div className="flex flex-col space-y-4 p-6">
                            {navItems.map((item) => {
                                const isActive =
                                    item.href === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.href);

                                const Icon = item.icon;

                                return (
                                    <motion.div key={item.href} variants={itemVariants}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                            onClick={onClose}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
