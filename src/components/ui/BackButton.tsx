'use client';
// src/components/ui/BackButton.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps extends React.HTMLAttributes<HTMLElement> {
    href?: string;
    children?: React.ReactNode;
    fallbackTitle?: string;
}

/**
 * 뒤로 가기 버튼 컴포넌트
 *
 * @param href - 링크 경로 (지정하지 않으면 브라우저 히스토리 뒤로 가기)
 * @param children - 버튼 내부 텍스트/요소
 * @param fallbackTitle - 자식 요소가 없을 때 표시할 기본 텍스트
 * @param className - 추가 CSS 클래스
 * @param props - 기타 HTML 속성
 */
export default function BackButton({
                                       href,
                                       children,
                                       fallbackTitle = '뒤로 가기',
                                       className,
                                       ...props
                                   }: BackButtonProps) {
    const router = useRouter();

    // 링크가 있으면 Link 컴포넌트 사용, 없으면 버튼으로 뒤로 가기
    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    "inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors",
                    className
                )}
                {...props}
            >
                <ChevronLeft className="mr-1 h-4 w-4" />
                {children || fallbackTitle}
            </Link>
        );
    }

    // 링크가 없으면 브라우저 히스토리 뒤로 가기
    return (
        <button
            type="button"
            onClick={() => router.back()}
            className={cn(
                "inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border-0 bg-transparent cursor-pointer",
                className
            )}
            {...props}
        >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {children || fallbackTitle}
        </button>
    );
}
