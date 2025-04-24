// src/app/blog/components/PostList.tsx 수정
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostsResponse } from '@/modules/blog/blog.types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface PostListProps {
    postsData: PostsResponse;
}

export default function PostList({ postsData }: PostListProps) {
    const { posts, pagination } = postsData;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 페이지 변경 핸들러
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-8">
            {/* 그리드 형태의 포스트 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        href={`/blog/${post.slug}`}
                        key={post.id}
                        className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* 썸네일 영역 - 고정 높이 및 이미지 깨짐 방지 */}
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {post.thumbnail ? (
                                <Image
                                    src={post.thumbnail}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        // 이미지 로드 실패 시 기본 스타일 적용
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                        target.parentElement!.innerHTML = '<span class="text-gray-400 dark:text-gray-500 text-xl font-light">No Image</span>';
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700">
                                    <span className="text-gray-400 dark:text-gray-500 text-xl font-light">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* 콘텐츠 영역 - 최소 높이 설정 및 내용 정렬 */}
                        <div className="flex flex-col flex-grow p-5 min-h-[200px]">
                            {/* 태그 영역 */}
                            <div className="flex flex-wrap gap-1.5 mb-2 h-6 overflow-hidden">
                                {post.tags && post.tags.length > 0 ? (
                                    <>
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <Badge key={tag.id} variant="secondary" className="px-2 py-0.5 text-xs font-normal truncate max-w-[100px]">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                        {post.tags.length > 3 && (
                                            <Badge variant="outline" className="px-2 py-0.5 text-xs font-normal">
                                                +{post.tags.length - 3}
                                            </Badge>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-xs text-gray-400">태그 없음</span>
                                )}
                            </div>

                            {/* 제목 영역 - 고정 높이 및 텍스트 자름 */}
                            <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 h-14">
                                {post.title || '제목 없음'}
                            </h2>

                            {/* 작성자 및 날짜 영역 */}
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <div className="flex items-center">
                                    {post.author?.image ? (
                                        <div className="relative w-6 h-6 mr-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                            <Image
                                                src={post.author.image}
                                                alt={post.author.name || '작성자'}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2" />
                                    )}
                                    <span className="truncate max-w-[80px]">{post.author?.name || '작성자'}</span>
                                </div>
                                <span className="mx-2">•</span>
                                <div className="flex items-center flex-shrink-0">
                                    <Calendar size={14} className="mr-1 flex-shrink-0" />
                                    <time dateTime={new Date(post.createdAt).toISOString()} className="truncate">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                                    </time>
                                </div>
                            </div>

                            {/* 통계 영역 - 조회수, 댓글, 좋아요 */}
                            <div className="flex items-center mt-auto pt-3 text-sm text-gray-500 dark:text-gray-400 border-t">
                                <div className="flex items-center mr-4">
                                    <Eye size={14} className="mr-1 flex-shrink-0" />
                                    <span>{post.viewCount || 0}</span>
                                </div>
                                <div className="flex items-center mr-4">
                                    <MessageSquare size={14} className="mr-1 flex-shrink-0" />
                                    <span>{post._count?.comments || 0}</span>
                                </div>
                                <div className="flex items-center">
                                    <ThumbsUp size={14} className="mr-1 flex-shrink-0" />
                                    <span>{post._count?.likes || 0}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 페이지네이션 - 이전과 동일 */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-10">
                    <nav className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            disabled={pagination.page === 1}
                        >
                            처음
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            이전
                        </Button>

                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            // 표시할 페이지 번호 범위 계산
                            let start = Math.max(1, pagination.page - 2);
                            let end = Math.min(pagination.totalPages, start + 4);
                            start = Math.max(1, end - 4);

                            const pageNum = start + i;
                            if (pageNum <= pagination.totalPages) {
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pagination.page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        className="w-9"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            }
                            return null;
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            다음
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.totalPages)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            마지막
                        </Button>
                    </nav>
                </div>
            )}
        </div>
    );
}
