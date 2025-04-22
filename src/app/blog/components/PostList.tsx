'use client';
// src/app/blog/components/PostList.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PostsResponse } from '@/modules/blog/blog.types';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostListProps {
    postsData: PostsResponse;
}

export default function PostList({ postsData }: PostListProps) {
    const { posts, pagination } = postsData;

    return (
        <div>
            {/* 포스트 목록 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* 썸네일 이미지 */}
                        <div className="relative aspect-video">
                            {post.thumbnail ? (
                                <Image
                                    src={post.thumbnail}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">이미지 없음</span>
                                </div>
                            )}
                        </div>

                        {/* 포스트 내용 */}
                        <div className="p-4">
                            {/* 태그 */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/blog?tag=${tag.name}`}
                                    >
                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded">
                      {tag.name}
                    </span>
                                    </Link>
                                ))}
                            </div>

                            {/* 제목 */}
                            <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                                    {post.title}
                                </Link>
                            </h2>

                            {/* 작성자 및 날짜 */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  {post.author.image && (
                      <Image
                          src={post.author.image}
                          alt={post.author.name || '작성자'}
                          width={20}
                          height={20}
                          className="rounded-full"
                      />
                  )}
                    {post.author.name || '익명'}
                </span>
                                <span>•</span>
                                <span>
                  {format(new Date(post.createdAt), 'yyyy년 M월 d일', { locale: ko })}
                </span>
                            </div>

                            {/* 통계 정보 */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                    {post.viewCount}
                </span>
                                <span className="flex items-center gap-1">
                  <Heart size={16} />
                                    {post._count.likes}
                </span>
                                <span className="flex items-center gap-1">
                  <MessageSquare size={16} />
                                    {post._count.comments}
                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center gap-2 mt-8">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => window.location.href = `/blog?page=${pagination.page - 1}`}
                >
                    이전
                </Button>

                {/* 페이지 번호 */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    // 표시할 페이지 번호 계산 (현재 페이지 중심으로 최대 5개)
                    const pageNum = Math.max(
                        1,
                        Math.min(
                            pagination.page - 2 + i,
                            pagination.totalPages
                        )
                    );

                    return (
                        <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => window.location.href = `/blog?page=${pageNum}`}
                        >
                            {pageNum}
                        </Button>
                    );
                })}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => window.location.href = `/blog?page=${pagination.page + 1}`}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
