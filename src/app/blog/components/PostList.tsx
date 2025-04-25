"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Eye, MessageSquare, Heart, Calendar } from 'lucide-react';
import { PostsResponse } from '@/modules/blog/blog.types';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

/**
 * 포스트 카드 목록 컴포넌트
 *
 * 서버에서 가져온 포스트 데이터를 그리드 형태로 표시합니다.
 * 각 포스트 카드는 썸네일, 제목, 날짜, 조회수, 좋아요 정보를 포함합니다.
 */
export default function PostList({ postsData }: { postsData: PostsResponse }) {
    const { posts, pagination } = postsData;

    // URL 파라미터 유지를 위한 함수
    const getPageUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());

        // 기존 필터 유지
        if (postsData.posts[0]?.tags?.[0]?.name) {
            params.set('tag', postsData.posts[0].tags[0].name);
        }

        return `/blog?${params.toString()}`;
    };

    return (
        <div className="space-y-8">
            {/* 포스트 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        href={`/blog/${post.slug}`}
                        key={post.id}
                        className="group flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                        {/* 포스트 썸네일 */}
                        <div className="relative aspect-video overflow-hidden bg-muted">
                            {post.thumbnail ? (
                                <Image
                                    src={post.thumbnail}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-muted">
                                    <span className="text-muted-foreground text-xl">이미지 없음</span>
                                </div>
                            )}
                        </div>

                        {/* 포스트 컨텐츠 */}
                        <div className="flex flex-col flex-grow p-5">
                            {/* 포스트 태그 */}
                            {post.tags.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-2">
                                    {post.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                        >
                      {tag.name}
                    </span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      +{post.tags.length - 3}
                    </span>
                                    )}
                                </div>
                            )}

                            {/* 포스트 제목 */}
                            <h3 className="mb-2 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>

                            {/* 포스트 메타데이터 */}
                            <div className="mt-auto pt-4 flex items-center text-sm text-muted-foreground space-x-4">
                                {/* 작성 날짜 */}
                                <div className="flex items-center">
                                    <Calendar className="mr-1 h-3.5 w-3.5" />
                                    <span>{format(new Date(post.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}</span>
                                </div>

                                {/* 조회수 */}
                                <div className="flex items-center">
                                    <Eye className="mr-1 h-3.5 w-3.5" />
                                    <span>{post.viewCount}</span>
                                </div>

                                {/* 댓글 수 */}
                                <div className="flex items-center">
                                    <MessageSquare className="mr-1 h-3.5 w-3.5" />
                                    <span>{post._count.comments}</span>
                                </div>

                                {/* 좋아요 수 */}
                                <div className="flex items-center">
                                    <Heart className="mr-1 h-3.5 w-3.5" />
                                    <span>{post._count.likes}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
                <Pagination className="my-8">
                    <PaginationContent>
                        {/* 이전 페이지 버튼 */}
                        {pagination.page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious href={getPageUrl(pagination.page - 1)} />
                            </PaginationItem>
                        )}

                        {/* 첫 페이지 버튼 (현재 페이지가 4 이상일 때) */}
                        {pagination.page >= 4 && (
                            <PaginationItem>
                                <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
                            </PaginationItem>
                        )}

                        {/* 생략 부호 (현재 페이지가 5 이상일 때) */}
                        {pagination.page >= 5 && (
                            <PaginationItem>
                                <span className="px-2.5">...</span>
                            </PaginationItem>
                        )}

                        {/* 페이지 번호 (최대 5개씩 표시) */}
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                const diff = Math.abs(page - pagination.page);
                                return diff < 2 || (page === 1 || page === pagination.totalPages);
                            })
                            .filter((page, _, arr) => {
                                // 첫 페이지와 마지막 페이지는 별도로 처리하므로 여기서는 제외
                                if (pagination.totalPages > 7 && (page === 1 || page === pagination.totalPages)) {
                                    return false;
                                }
                                return true;
                            })
                            .map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href={getPageUrl(page)}
                                        isActive={page === pagination.page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                        {/* 생략 부호 (현재 페이지가 마지막에서 4 페이지 이전일 때) */}
                        {pagination.page < pagination.totalPages - 3 && (
                            <PaginationItem>
                                <span className="px-2.5">...</span>
                            </PaginationItem>
                        )}

                        {/* 마지막 페이지 버튼 (현재 페이지가 마지막에서 3 페이지 이전일 때) */}
                        {pagination.page < pagination.totalPages - 2 && (
                            <PaginationItem>
                                <PaginationLink href={getPageUrl(pagination.totalPages)}>
                                    {pagination.totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* 다음 페이지 버튼 */}
                        {pagination.page < pagination.totalPages && (
                            <PaginationItem>
                                <PaginationNext href={getPageUrl(pagination.page + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
