// src/app/blog/[slug]/page.tsx
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import * as blogService from '@/modules/blog/blog.service';
import PostDetail from './components/PostDetail';
import PostDetailSkeleton from './components/PostDetailSkeleton';
import RelatedPosts from './components/RelatedPosts';
import BackButton from '@/components/ui/BackButton';

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';

// 동적 메타데이터 생성
export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const post = await blogService.getPostBySlug(params.slug, false);

        return {
            title: `${post.title} | 블로그`,
            description: post.content.slice(0, 160), // 첫 160자를 설명으로 사용
            openGraph: {
                title: post.title,
                description: post.content.slice(0, 160),
                images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
            },
        };
    } catch (error) {
        return {
            title: '포스트를 찾을 수 없습니다',
            description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
        };
    }
}

// 테스트 데이터 - 실제로는 DB에서 가져와야 함
const dummyComments = [
    {
        id: 'comment1',
        content: '정말 좋은 글이네요! 많은 도움이 되었습니다.',
        createdAt: new Date('2023-11-15T14:30:00').toISOString(),
        user: {
            id: 'user1',
            name: '김철수',
            image: 'https://api.dicebear.com/7.x/personas/svg?seed=user1'
        },
        replies: [
            {
                id: 'reply1',
                content: '감사합니다! 더 좋은 내용으로 찾아뵙겠습니다.',
                createdAt: new Date('2023-11-15T16:20:00').toISOString(),
                user: {
                    id: 'author',
                    name: '블로그 운영자',
                    image: 'https://api.dicebear.com/7.x/personas/svg?seed=admin'
                }
            }
        ]
    },
    {
        id: 'comment2',
        content: '궁금한 점이 있는데요, 이 기술을 실제 프로젝트에 적용할 때 고려해야 할 점은 무엇인가요?',
        createdAt: new Date('2023-11-16T09:15:00').toISOString(),
        user: {
            id: 'user2',
            name: '박지영',
            image: 'https://api.dicebear.com/7.x/personas/svg?seed=user2'
        },
        replies: []
    }
];

// 포스트 데이터 가져오기 (테스트 데이터 추가)
async function getPost(slug: string) {
    try {
        const post = await blogService.getPostBySlug(slug, true); // 조회수 증가

        // 테스트를 위해 댓글 데이터 추가
        return {
            ...post,
            comments: dummyComments,
            _count: {
                ...post._count,
                comments: dummyComments.length +
                    dummyComments.reduce((acc, comment) => acc + comment.replies.length, 0)
            }
        };
    } catch (error) {
        notFound(); // 404 페이지로 리다이렉트
    }
}

// 블로그 포스트 상세 페이지 컴포넌트
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton href="/blog" className="mb-6">블로그 목록으로 돌아가기</BackButton>

            {/* 테스트 모드 안내 */}
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-700 mb-2">🧪 테스트 모드</h2>
                <p className="text-yellow-700">
                    현재 인증 기능이 구현되지 않아 테스트 모드로 실행 중입니다.
                    '테스트 로그인하기' 버튼을 클릭하여 댓글 및 좋아요 기능을 테스트해볼 수 있습니다.
                </p>
            </div>

            {/* 포스트 상세 내용 */}
            <Suspense fallback={<PostDetailSkeleton />}>
                <PostDetailWithData slug={params.slug} />
            </Suspense>
        </div>
    );
}

// 데이터를 가져와서 PostDetail 컴포넌트로 전달
async function PostDetailWithData({ slug }: { slug: string }) {
    const post = await getPost(slug);

    return (
        <>
            <PostDetail post={post} />

            {/* 관련 포스트 */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">관련 포스트</h2>
                <Suspense fallback={<div className="animate-pulse h-60 bg-gray-100 rounded-lg"></div>}>
                    <RelatedPosts postId={post.id} />
                </Suspense>
            </div>
        </>
    );
}
