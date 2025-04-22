'use client';
// src/app/blog/[slug]/components/RelatedPosts.tsx - 테스트용
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Eye, MessageSquare } from 'lucide-react';

// 테스트용 더미 데이터
const dummyRelatedPosts = [
    {
        id: 'post1',
        title: 'Next.js 15의 새로운 기능 살펴보기',
        slug: 'next-js-15-features',
        thumbnail: 'https://picsum.photos/seed/next15/800/450',
        createdAt: new Date('2023-11-01').toISOString(),
        viewCount: 423,
        author: {
            id: 'author1',
            name: '개발왕',
            image: 'https://api.dicebear.com/7.x/personas/svg?seed=dev1'
        },
        tags: [
            { id: 'tag1', name: 'Next.js' },
            { id: 'tag2', name: 'React' }
        ],
        _count: {
            comments: 15,
            likes: 32
        }
    },
    {
        id: 'post2',
        title: 'Prisma를 활용한 데이터베이스 설계',
        slug: 'prisma-database-design',
        thumbnail: 'https://picsum.photos/seed/prisma/800/450',
        createdAt: new Date('2023-10-25').toISOString(),
        viewCount: 312,
        author: {
            id: 'author1',
            name: '개발왕',
            image: 'https://api.dicebear.com/7.x/personas/svg?seed=dev1'
        },
        tags: [
            { id: 'tag3', name: 'Prisma' },
            { id: 'tag4', name: 'Database' }
        ],
        _count: {
            comments: 8,
            likes: 27
        }
    },
    {
        id: 'post3',
        title: 'TailwindCSS로 반응형 디자인 구현하기',
        slug: 'tailwind-responsive-design',
        thumbnail: 'https://picsum.photos/seed/tailwind/800/450',
        createdAt: new Date('2023-11-10').toISOString(),
        viewCount: 285,
        author: {
            id: 'author2',
            name: '디자인고수',
            image: 'https://api.dicebear.com/7.x/personas/svg?seed=design1'
        },
        tags: [
            { id: 'tag5', name: 'TailwindCSS' },
            { id: 'tag6', name: 'CSS' },
            { id: 'tag7', name: 'Responsive' }
        ],
        _count: {
            comments: 12,
            likes: 45
        }
    }
];

interface RelatedPostsProps {
    postId: string;
}

export default function RelatedPosts({ postId }: RelatedPostsProps) {
    // 실제로는 API 호출이나 데이터 페칭이 필요하지만 테스트용으로 더미 데이터 사용
    const relatedPosts = dummyRelatedPosts;

    if (relatedPosts.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">관련 포스트가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
                <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                    {/* 썸네일 */}
                    <div className="relative aspect-video">
                        {post.thumbnail ? (
                            <Image
                                src={post.thumbnail}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">이미지 없음</span>
                            </div>
                        )}
                    </div>

                    {/* 포스트 정보 */}
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>

                        <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {format(new Date(post.createdAt), 'yyyy.MM.dd', { locale: ko })}
              </span>

                            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                    {post.viewCount}
                </span>
                                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                                    {post._count.comments}
                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
