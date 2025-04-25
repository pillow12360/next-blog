// src/app/blog/layout.tsx
import React from 'react';
import Link from 'next/link';
import { FileText, Tag, Calendar, BookOpen, TrendingUp, Edit, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

/**
 * 블로그 레이아웃 컴포넌트
 * 모든 블로그 페이지에 공통으로 적용되는 레이아웃을 정의합니다.
 * Next.js의 App Router에서는 layout.tsx 파일이 해당 경로와 하위 경로의 모든 페이지에 적용됩니다.
 *
 * 이 레이아웃은 루트 레이아웃(MainLayout)과 중첩되어 사용됩니다.
 */
export default function BlogLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            {/* 블로그 서브 헤더 */}
            <div className="border-b bg-card/40 backdrop-blur-sm sticky top-16 z-10">
                <div className="container mx-auto px-4">
                    {/* 데스크탑 헤더 */}
                    <div className="hidden md:flex md:items-center md:justify-between py-4">
                        <div className="flex items-center gap-8">
                            {/* 블로그 제목 */}
                            <div>
                                <Link href="/blog" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    <h1 className="text-xl font-bold">Blog</h1>
                                </Link>
                            </div>

                            {/* 블로그 내비게이션 */}
                            <nav className="flex items-center space-x-1">
                                <Link
                                    href="/blog"
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>전체글</span>
                  </span>
                                </Link>
                                <Link
                                    href="/blog?sortBy=popular"
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    <span>인기글</span>
                  </span>
                                </Link>
                                <Link
                                    href="/blog/tags"
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    <span>태그</span>
                  </span>
                                </Link>
                                <Link
                                    href="/blog/archive"
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>아카이브</span>
                  </span>
                                </Link>
                            </nav>
                        </div>

                        {/* 우측 액션 버튼들 */}
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground" asChild>
                                <Link href="/blog?open=search" aria-label="블로그 검색">
                                    <Search className="h-4 w-4" />
                                </Link>
                            </Button>

                            <Button size="sm" variant="default" className="gap-1.5" asChild>
                                <Link href="/admin/posts/write">
                                    <Edit className="h-4 w-4" />
                                    <span>글쓰기</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* 모바일 헤더 */}
                    <div className="md:hidden flex items-center justify-between py-3">
                        <Link href="/blog" className="flex items-center gap-1.5">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <h1 className="text-lg font-bold">Blog</h1>
                        </Link>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href="/blog?open=search" aria-label="블로그 검색">
                                    <Search className="h-4 w-4" />
                                </Link>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <FileText className="h-4 w-4" />
                                        <span className="sr-only">블로그 메뉴</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/blog">전체글</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/blog?sortBy=popular">인기글</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/blog/tags">태그</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/blog/archive">아카이브</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/posts/write">글쓰기</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* 블로그 컨텐츠 영역 */}
            <div className="py-8">
                {children}
            </div>
        </div>
    );
}
