'use client';
// src/app/blog/[slug]/components/PostDetail.tsx - 인증 없이 테스트용
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Heart, Bookmark, MessageSquare, Eye, Share2 } from 'lucide-react';
import { PostDetail as PostDetailType } from '@/modules/blog/blog.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CommentSection from './CommentSection';
import Markdown from '@/components/ui/Markdown';
import ShareModal from './ShareModal';

// 테스트용 더미 인터랙션 데이터
const dummyInteractions = {
    liked: false,
    bookmarked: false
};

interface PostDetailProps {
    post: PostDetailType;
}

export default function PostDetail({ post }: PostDetailProps) {
    // 테스트용 더미 유저
    const dummyUser = {
        id: 'test-user-id',
        name: '테스트 사용자',
        image: 'https://api.dicebear.com/7.x/personas/svg?seed=admin'
    };

    // 테스트용 로그인 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 인터랙션 상태
    const [interactions, setInteractions] = useState(dummyInteractions);

    // 공유 모달 상태
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // 좋아요 토글 핸들러
    const handleLikeToggle = () => {
        if (!isLoggedIn) {
            alert('테스트: 로그인이 필요합니다. (로그인 버튼을 눌러보세요)');
            return;
        }

        setInteractions(prev => ({
            ...prev,
            liked: !prev.liked
        }));
    };

    // 북마크 토글 핸들러
    const handleBookmarkToggle = () => {
        if (!isLoggedIn) {
            alert('테스트: 로그인이 필요합니다. (로그인 버튼을 눌러보세요)');
            return;
        }

        setInteractions(prev => ({
            ...prev,
            bookmarked: !prev.bookmarked
        }));
    };

    return (
        <article className="max-w-4xl mx-auto">
            {/* 테스트용 로그인 버튼 */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-600">
                        {isLoggedIn
                            ? `테스트 모드: ${dummyUser.name}로 로그인됨`
                            : '테스트 모드: 로그인되지 않음'}
                    </div>
                    <Button
                        onClick={() => setIsLoggedIn(!isLoggedIn)}
                        variant={isLoggedIn ? "destructive" : "default"}
                        size="sm"
                    >
                        {isLoggedIn ? '로그아웃하기' : '테스트 로그인하기'}
                    </Button>
                </div>
            </div>

            {/* 헤더 */}
            <header className="mb-8">
                {/* 카테고리 & 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                        <Link key={tag.id} href={`/blog?tag=${tag.name}`}>
                            <Badge variant="outline" className="hover:bg-gray-100">
                                {tag.name}
                            </Badge>
                        </Link>
                    ))}
                </div>

                {/* 제목 */}
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between mb-6">
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-2">
                        {post.author.image ? (
                            <Image
                                src={post.author.image}
                                alt={post.author.name || '작성자'}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {post.author.name?.charAt(0) || 'A'}
                </span>
                            </div>
                        )}
                        <div>
                            <p className="font-medium">{post.author.name || '익명'}</p>
                            <p className="text-sm text-gray-500">
                                {format(new Date(post.createdAt), 'yyyy년 M월 d일', { locale: ko })}
                            </p>
                        </div>
                    </div>

                    {/* 통계 */}
                    <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1">
              <Eye size={18} />
                {post.viewCount}
            </span>
                        <span className="flex items-center gap-1">
              <MessageSquare size={18} />
                            {post._count.comments}
            </span>
                    </div>
                </div>
            </header>

            {/* 썸네일 이미지 */}
            {post.thumbnail && (
                <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* 본문 내용 */}
            <div className="prose prose-lg max-w-none mb-8">
                <Markdown content={post.content} />
            </div>

            {/* 인터랙션 버튼 */}
            <div className="flex items-center justify-between py-6 border-t border-b mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 ${
                            interactions.liked ? 'text-red-500' : 'text-gray-500'
                        }`}
                        onClick={handleLikeToggle}
                    >
                        <Heart size={20} fill={interactions.liked ? 'currentColor' : 'none'} />
                        <span>{post._count.likes + (interactions.liked ? 1 : 0)}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 ${
                            interactions.bookmarked ? 'text-blue-500' : 'text-gray-500'
                        }`}
                        onClick={handleBookmarkToggle}
                    >
                        <Bookmark size={20} fill={interactions.bookmarked ? 'currentColor' : 'none'} />
                        <span>저장</span>
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                    onClick={() => setIsShareModalOpen(true)}
                >
                    <Share2 size={20} className="mr-1" />
                    <span>공유</span>
                </Button>
            </div>

            {/* 댓글 섹션 */}
            <CommentSectionTest
                postId={post.id}
                comments={post.comments}
                totalComments={post._count.comments}
                isLoggedIn={isLoggedIn}
                dummyUser={dummyUser}
            />

            {/* 공유 모달 */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                postTitle={post.title}
                postSlug={post.slug}
            />
        </article>
    );
}

// 테스트용 임시 CommentSection 컴포넌트
function CommentSectionTest({
                                postId,
                                comments,
                                totalComments,
                                isLoggedIn,
                                dummyUser
                            }: {
    postId: string;
    comments: any[];
    totalComments: number;
    isLoggedIn: boolean;
    dummyUser: any;
}) {
    const [commentContent, setCommentContent] = useState('');

    // 테스트용 댓글 추가 기능
    const [testComments, setTestComments] = useState<any[]>([]);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!commentContent.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        // 테스트용 댓글 추가
        const newComment = {
            id: `test-comment-${Date.now()}`,
            content: commentContent,
            createdAt: new Date().toISOString(),
            user: dummyUser,
            replies: []
        };

        setTestComments(prev => [newComment, ...prev]);
        setCommentContent('');
    };

    return (
        <section className="mt-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
                <MessageSquare className="mr-2" size={20} />
                댓글 <span className="text-gray-500 ml-1">({totalComments + testComments.length})</span>
            </h2>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
            placeholder={isLoggedIn ? '댓글을 작성해보세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full p-3 border rounded-md min-h-24 mb-2"
            disabled={!isLoggedIn}
        />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={!isLoggedIn}
                    >
                        댓글 등록
                    </Button>
                </div>
            </form>

            {/* 댓글 목록 - 테스트 댓글 먼저 보여줌 */}
            <div className="space-y-6">
                {testComments.length === 0 && comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        첫 번째 댓글을 작성해보세요!
                    </div>
                ) : (
                    <>
                        {/* 테스트 댓글 표시 */}
                        {testComments.map((comment) => (
                            <div key={comment.id} className="border rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    {comment.user.image && (
                                        <Image
                                            src={comment.user.image}
                                            alt={comment.user.name || '사용자'}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium">{comment.user.name} <span className="text-xs text-blue-500">(테스트)</span></div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(comment.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 text-gray-800 whitespace-pre-line">
                                    {comment.content}
                                </div>
                            </div>
                        ))}

                        {/* 기존 댓글 표시 */}
                        {comments.map((comment) => (
                            <div key={comment.id} className="border rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    {comment.user.image && (
                                        <Image
                                            src={comment.user.image}
                                            alt={comment.user.name || '사용자'}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium">{comment.user.name || '익명'}</div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(comment.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 text-gray-800 whitespace-pre-line">
                                    {comment.content}
                                </div>

                                {/* 대댓글이 있을 경우 표시 */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-4 ml-8 space-y-4 border-l-2 border-gray-200 pl-4">
                                        {comment.replies.map((reply: any) => (
                                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    {reply.user.image && (
                                                        <Image
                                                            src={reply.user.image}
                                                            alt={reply.user.name || '사용자'}
                                                            width={24}
                                                            height={24}
                                                            className="rounded-full"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-sm">{reply.user.name || '익명'}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {format(new Date(reply.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-1 text-gray-800 text-sm whitespace-pre-line">
                                                    {reply.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}
