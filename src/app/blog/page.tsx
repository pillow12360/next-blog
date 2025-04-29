// src/app/blog/page.tsx
import React from 'react';
import { Suspense } from 'react';
import { PostsResponse, PostSearchFilter } from '@/modules/blog/blog.types';
import PostList from './components/PostList';
import PostListSkeleton from './components/PostListSkeleton';
import SearchFilter from './components/SearchFilter';
import * as blogService from '@/modules/blog/blog.service';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Newspaper, Tag, Filter } from "lucide-react";

// 페이지 컴포넌트는 동적 라우팅에 의존하지 않도록 설정
export const dynamic = 'force-dynamic';

/**
 * 서버 컴포넌트에서 서비스 레이어 직접 호출
 */
async function getPosts(filter: PostSearchFilter = {}): Promise<PostsResponse> {
    try {
        return await blogService.getPosts(filter);
    } catch (error) {
        console.error('포스트 목록 조회 오류:', error);
        throw new Error('포스트 목록을 불러오는 데 실패했습니다.');
    }
}

/**
 * 인기 태그 목록 조회
 */
async function getPopularTags() {
    try {
        return await blogService.getTags();
    } catch (error) {
        console.error('태그 목록 조회 오류:', error);
        return [];
    }
}

/**
 * 블로그 메인 페이지 컴포넌트
 *
 * 블로그 포스트 목록을 보여주고, 검색과 필터링 기능을 제공합니다.
 */
export default async function BlogPage({
                                           searchParams,
                                       }: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    // 필터 구성 - searchParams를 타입 안전하게 사용
    const filter: PostSearchFilter = {
        keyword: (params.keyword as string) || '',
        tag: (params.tag as string) || '',
        page: params.page ? parseInt(params.page as string, 10) : 1,
        limit: params.limit ? parseInt(params.limit as string, 10) : 9,
        sortBy: (params.sortBy as 'latest' | 'popular' | 'comments') || 'latest'
    };

    // 인기 태그 가져오기
    const popularTags = await getPopularTags();

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 사이드바: 태그 및 필터링 */}
                <div className="lg:col-span-1 order-last lg:order-first">
                    <div className="sticky top-24 space-y-6">
                        {/* 검색 및 필터링 컴포넌트 */}
                        <div className="bg-card p-5 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Filter size={18} />
                                글 검색
                            </h3>
                            <SearchFilter initialFilter={filter} />
                        </div>

                        {/* 인기 태그 영역 */}
                        <div className="bg-card p-5 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Tag size={18} />
                                인기 태그
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {popularTags.slice(0, 15).map((tag) => (
                                    <Link
                                        href={`/blog?tag=${tag.name}`}
                                        key={tag.id}
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                            filter.tag === tag.name
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                        }`}
                                    >
                                        {tag.name}
                                        <span className="ml-1 text-xs opacity-70">({tag._count.posts})</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 메인 컨텐츠: 포스트 목록 */}
                <div className="lg:col-span-3">
                    {/* 현재 필터 표시 */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {filter.tag && (
                                <div className="flex items-center gap-1.5">
                                    <span>태그:</span>
                                    <span className="font-medium text-primary">{filter.tag}</span>
                                </div>
                            )}
                            {filter.keyword && (
                                <div className="flex items-center gap-1.5">
                                    <span>검색어:</span>
                                    <span className="font-medium text-primary">"{filter.keyword}"</span>
                                </div>
                            )}
                            {filter.sortBy && filter.sortBy !== 'latest' && (
                                <div className="flex items-center gap-1.5">
                                    <span>정렬:</span>
                                    <span className="font-medium text-primary">
                                        {filter.sortBy === 'popular' ? '인기순' : '댓글순'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Suspense로 로딩 상태 처리 */}
                    <Suspense fallback={<PostListSkeleton />}>
                        {/* PostList는 클라이언트 컴포넌트 */}
                        <PostListWithData filter={filter} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

/**
 * 데이터를 가져와서 PostList에 전달하는 서버 컴포넌트
 */
async function PostListWithData({ filter }: { filter: PostSearchFilter }) {
    // 서비스 레이어 직접 호출
    const postsData = await getPosts(filter);

    if (postsData.posts.length === 0) {
        return (
            <div className="bg-card rounded-lg shadow-sm border p-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <Newspaper className="w-12 h-12 text-muted-foreground/30" />
                    <h3 className="text-lg font-medium">포스트가 없습니다</h3>

                    {filter.tag || filter.keyword ? (
                        <p className="text-muted-foreground max-w-md">
                            검색 조건에 맞는 게시글이 없습니다. 다른 검색어나 태그를 시도해보세요.
                        </p>
                    ) : (
                        <p className="text-muted-foreground max-w-md">
                            아직 작성된 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!
                        </p>
                    )}

                    <div className="mt-3">
                        {filter.tag || filter.keyword ? (
                            <Link href="/blog">
                                <Button variant="outline" className="mt-2">
                                    모든 게시글 보기
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/admin/posts/write">
                                <Button className="mt-2">
                                    <PlusCircle size={16} className="mr-2" />
                                    게시글 작성하기
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return <PostList postsData={postsData} />;
}
