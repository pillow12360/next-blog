// src/app/blog/components/SearchFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PostSearchFilter } from '@/modules/blog/blog.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchFilterProps {
    initialFilter: PostSearchFilter;
}

export default function SearchFilter({ initialFilter }: SearchFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 로컬 상태로 필터 관리
    const [keyword, setKeyword] = useState(initialFilter.keyword || '');
    const [sortBy, setSortBy] = useState(initialFilter.sortBy || 'latest');
    const [isExpanded, setIsExpanded] = useState(false);

    // URL 매개변수가 변경될 때 로컬 상태 업데이트
    useEffect(() => {
        setKeyword(searchParams.get('keyword') || '');
        setSortBy((searchParams.get('sortBy') as 'latest' | 'popular' | 'comments') || 'latest');
    }, [searchParams]);

    // 검색 핸들러
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (keyword) params.set('keyword', keyword);
        if (sortBy) params.set('sortBy', sortBy);
        if (initialFilter.tag) params.set('tag', initialFilter.tag);

        // 검색 시 항상 첫 페이지로
        router.push(`${pathname}?${params.toString()}`);
    };

    // 정렬 변경 핸들러
    const handleSortChange = (value: string) => {
        setSortBy(value as 'latest' | 'popular' | 'comments');

        const params = new URLSearchParams();

        if (keyword) params.set('keyword', keyword);
        if (value) params.set('sortBy', value);
        if (initialFilter.tag) params.set('tag', initialFilter.tag);

        router.push(`${pathname}?${params.toString()}`);
    };

    // 검색어 초기화 핸들러
    const handleClearKeyword = () => {
        setKeyword('');

        const params = new URLSearchParams();
        if (sortBy) params.set('sortBy', sortBy);
        if (initialFilter.tag) params.set('tag', initialFilter.tag);

        router.push(`${pathname}?${params.toString()}`);
    };

    // 필터 초기화 핸들러
    const handleResetFilters = () => {
        setKeyword('');
        setSortBy('latest');
        router.push(pathname);
    };

    // 현재 적용된 필터 갯수 계산
    const activeFiltersCount = [
        keyword ? 1 : 0,
        sortBy !== 'latest' ? 1 : 0,
        initialFilter.tag ? 1 : 0
    ].reduce((sum, count) => sum + count, 0);

    return (
        <Card className="bg-white dark:bg-gray-800 overflow-hidden">
            <CardContent className="p-0">
                {/* 간단한 검색 인터페이스 */}
                <div className="p-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="검색어를 입력하세요"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="pl-9 pr-8"
                            />
                            {keyword && (
                                <button
                                    type="button"
                                    onClick={handleClearKeyword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <Button type="submit" variant="default">검색</Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="relative"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <SlidersHorizontal size={18} />
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-4 h-4 rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* 확장된 필터 옵션 */}
                {isExpanded && (
                    <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Filter size={14} className="mr-2" />
                                    <span>정렬 기준</span>
                                </div>

                                {sortBy !== 'latest' && (
                                    <button
                                        onClick={() => handleSortChange('latest')}
                                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        기본값으로 재설정
                                    </button>
                                )}
                            </div>

                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="정렬 기준" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">최신순</SelectItem>
                                    <SelectItem value="popular">인기순</SelectItem>
                                    <SelectItem value="comments">댓글순</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 적용된 필터 표시 */}
                        {activeFiltersCount > 0 && (
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">적용된 필터</span>
                                    <button
                                        onClick={handleResetFilters}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        모두 초기화
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {keyword && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            검색어: {keyword}
                                            <button onClick={handleClearKeyword} className="ml-1">
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    )}

                                    {sortBy !== 'latest' && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            정렬: {sortBy === 'popular' ? '인기순' : sortBy === 'comments' ? '댓글순' : '최신순'}
                                            <button onClick={() => handleSortChange('latest')} className="ml-1">
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    )}

                                    {initialFilter.tag && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            태그: {initialFilter.tag}
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams();
                                                    if (keyword) params.set('keyword', keyword);
                                                    if (sortBy !== 'latest') params.set('sortBy', sortBy);
                                                    router.push(`${pathname}?${params.toString()}`);
                                                }}
                                                className="ml-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
