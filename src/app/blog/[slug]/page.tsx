import React, { Suspense } from 'react';
import {notFound} from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import * as blogService from '@/modules/blog/blog.service';
import PostDetail from './components/PostDetail';
import PostDetailSkeleton from './components/PostDetailSkeleton';
import RelatedPosts from './components/RelatedPosts';
import BackButton from '@/components/ui/BackButton';
import {Button} from "@/components/ui/button";
import {auth} from "@/auth";
import Link from "next/link";
import DeleteButton from './components/DeleteButton'; // 새로 만든 클라이언트 컴포넌트 임포트

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

// 포스트 데이터 가져오기
async function getPost(slug: string) {
    try {
        const post = await blogService.getPostBySlug(slug, true); // 조회수 증가

        return {
            ...post,
            comments: post.comments,
            _count: {
                ...post._count,
                comments: post.comments.length +
                    post.comments.reduce((acc, comment) => acc + comment.replies.length, 0)
            }
        };
    } catch (error) {
        notFound(); // 404 페이지로 리다이렉트
    }
}

// 블로그 포스트 상세 페이지 컴포넌트
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const session = await auth();
    const post = await blogService.getPostBySlug(params.slug, true);
    const {id} = post.author;
    const {slug} = params;
    const isWriter = session?.user.id === id;

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton href="/blog" className="mb-6">블로그 목록으로 돌아가기</BackButton>

            <div className="flex gap-2 mb-6">
                {isWriter && (
                    <Button variant="outline">
                        <Link href={`/blog/${params.slug}/edit`}>게시글 수정하기</Link>
                    </Button>
                )}

                {isWriter && (
                    <DeleteButton slug={slug} />
                )}
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
