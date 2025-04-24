"use client";

// src/components/layout/PageTransition.tsx
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

/**
 * 페이지 전환 애니메이션 컴포넌트 - 클라이언트 컴포넌트
 *
 * 페이지 변경 시 부드러운 전환 효과를 제공합니다.
 * Framer Motion의 AnimatePresence를 활용합니다.
 */
export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    // 페이지 전환 애니메이션 변수
    const variants = {
        hidden: { opacity: 0, y: 10 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.3,
                }}
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
