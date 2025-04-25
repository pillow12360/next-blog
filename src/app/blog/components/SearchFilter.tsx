"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PostSearchFilter } from '@/modules/blog/blog.types';

/**
 * SearchFilter 컴포넌트 - 블로그 포스트 검색 및 필터링 기능 제공
 *
 * 이 컴포넌트는 클라이언트 컴포넌트로, 사용자가 검색어를 입력하고
 * 정렬 방식을 선택하여 블로그 포스트를 필터링할 수 있게 합니다.
 */
export default function SearchFilter({ initialFilter }: { initialFilter: PostSearchFilter }) {
    const router = useRouter();
    const [keyword, setKeyword] = useState(initialFilter.keyword || '');
    const [sortBy, setSortBy] = useState(initialFilter.sortBy || 'latest');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // 검색 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 현재 URL 파라미터 유지하면서 새 검색어 추가
        const params = new URLSearchParams();

        // 키워드가 있으면 추가
        if (keyword) {
            params.set('keyword', keyword);
        }

        // 태그가 있으면 유지
        if (initialFilter.tag) {
            params.set('tag', initialFilter.tag);
        }

        // 정렬 방식 추가
        params.set('sortBy', sortBy);

        // 페이지는 검색 시 1페이지로 리셋
        params.set('page', '1');

        // 필터링된 URL로 이동
        router.push(`/blog?${params.toString()}`);
    };

    // 필터 초기화 핸들러
    const handleReset = () => {
        setKeyword('');
        setSortBy('latest');
        router.push('/blog');
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 검색창 */}
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="pr-10"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* 고급 필터 토글 버튼 */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1 text-muted-foreground"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    <SlidersHorizontal size={14} />
                    <span>{showAdvanced ? '간단히 보기' : '고급 필터'}</span>
                </Button>

                {/* 고급 필터 옵션 */}
                {showAdvanced && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label htmlFor="sortBy" className="text-sm font-medium">
                                정렬 기준
                            </label>
                            <Select
                                value={sortBy}
                                onValueChange={(value) => setSortBy(value as 'latest' | 'popular' | 'comments')}
                            >
                                <SelectTrigger id="sortBy">
                                    <SelectValue placeholder="정렬 기준 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">최신순</SelectItem>
                                    <SelectItem value="popular">인기순</SelectItem>
                                    <SelectItem value="comments">댓글순</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    {/* 검색 버튼 */}
                    <Button type="submit" className="flex-1">
                        <Search className="mr-2 h-4 w-4" />
                        검색하기
                    </Button>

                    {/* 초기화 버튼 */}
                    {(initialFilter.keyword || initialFilter.tag || initialFilter.sortBy !== 'latest') && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            className="flex items-center"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
