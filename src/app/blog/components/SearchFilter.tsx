'use client';
// src/app/blog/components/SearchFilter.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { PostSearchFilter } from '@/modules/blog/blog.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SearchFilterProps {
    initialFilter: PostSearchFilter;
}

export default function SearchFilter({ initialFilter }: SearchFilterProps) {
    const router = useRouter();
    const [keyword, setKeyword] = useState(initialFilter.keyword || '');
    const [sortBy, setSortBy] = useState(initialFilter.sortBy || 'latest');

    // 검색 실행 함수
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ keyword, sortBy });
    };

    // 정렬 변경 함수
    const handleSortChange = (value: string) => {
        setSortBy(value as 'latest' | 'popular' | 'comments');
        applyFilters({
            keyword,
            sortBy: value as 'latest' | 'popular' | 'comments'
        });
    };

    // URL 변경 함수
    const applyFilters = (filters: Partial<PostSearchFilter>) => {
        // 현재 URL 가져오기
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        // 필터 적용
        if (filters.keyword) {
            params.set('keyword', filters.keyword);
        } else {
            params.delete('keyword');
        }

        if (filters.sortBy) {
            params.set('sortBy', filters.sortBy);
        }

        // 필터 적용 시 항상 첫 페이지로 이동
        params.set('page', '1');

        // 태그 필터는 유지
        if (initialFilter.tag) {
            params.set('tag', initialFilter.tag);
        }

        // 라우터로 이동
        router.push(`/blog?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-lg mb-8">
            {/* 검색 필터 표시 */}
            {initialFilter.tag && (
                <div className="flex items-center gap-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <span>태그: {initialFilter.tag}</span>
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                            const url = new URL(window.location.href);
                            const params = new URLSearchParams(url.search);
                            params.delete('tag');
                            router.push(`/blog?${params.toString()}`);
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit" variant="default">
                    검색
                </Button>
            </form>

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">정렬:</span>
                <Select
                    value={sortBy}
                    onValueChange={handleSortChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="정렬 기준" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">최신순</SelectItem>
                        <SelectItem value="popular">인기순</SelectItem>
                        <SelectItem value="comments">댓글순</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
