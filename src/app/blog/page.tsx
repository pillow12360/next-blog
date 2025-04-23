// src/app/blog/page.tsx
import React from 'react';
import { Suspense } from 'react';
import { PostsResponse, PostSearchFilter } from '@/modules/blog/blog.types';
import PostList from './components/PostList';
import PostListSkeleton from './components/PostListSkeleton';
import SearchFilter from './components/SearchFilter';
import * as blogService from '@/modules/blog/blog.service';
import {Button} from "@/components/ui/button";
import Link from "next/link";

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

// 블로그 메인 페이지 컴포넌트
export default async function BlogPage({
                                           searchParams,
                                       }: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // 필터 구성 - searchParams를 타입 안전하게 사용
    const filter: PostSearchFilter = {
        keyword: searchParams.keyword as string || '',
        tag: searchParams.tag as string || '',
        page: searchParams.page ? parseInt(searchParams.page as string, 10) : 1,
        limit: searchParams.limit ? parseInt(searchParams.limit as string, 10) : 10,
        sortBy: (searchParams.sortBy as 'latest' | 'popular' | 'comments') || 'latest'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">동찬 블로그</h1>

            <Link href={'/blog/create'}><Button>새 게시글 작성</Button></Link>

            {/* 검색 및 필터링 컴포넌트 */}
            <SearchFilter initialFilter={filter} />

            {/* Suspense로 로딩 상태 처리 */}
            <Suspense fallback={<PostListSkeleton />}>
                {/* PostList는 클라이언트 컴포넌트 */}
                <PostListWithData filter={filter} />
            </Suspense>
        </div>
    );
}

// 데이터를 가져와서 PostList에 전달하는 서버 컴포넌트
async function PostListWithData({ filter }: { filter: PostSearchFilter }) {
    // 서비스 레이어 직접 호출
    const postsData = await getPosts(filter);

    if (postsData.posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">포스트가 없습니다.</p>
            </div>
        );
    }

    return <PostList postsData={postsData} />;
}
