'use client';
// src/app/blog/[slug]/components/CommentSection.tsx - 인증 없이 개발 버전 (타입 오류 수정)
import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MoreHorizontal, MessageSquare, Trash, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 댓글 타입 확장 (수정: updatedAt 속성 추가)
interface CommentWithUser {
    id: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string; // 이 속성이 빠져있어서 오류가 발생했음
    userId: string;
    postId: string;
    parentId: string | null;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
    replies?: CommentWithUser[];
}

interface CommentSectionProps {
    postId: string;
    comments: CommentWithUser[];
    totalComments: number;
    isLoggedIn?: boolean; // 개발용 로그인 상태
    dummyUser?: {
        id: string;
        name: string;
        image: string;
    }; // 개발용 더미 유저
}

export default function CommentSection({
                                           postId,
                                           comments,
                                           totalComments,
                                           isLoggedIn = false, // 기본값 설정
                                           dummyUser = {
                                               id: 'dev-user',
                                               name: '개발자',
                                               image: 'https://api.dicebear.com/7.x/personas/svg?seed=dev'
                                           }
                                       }: CommentSectionProps) {
    const [commentContent, setCommentContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    // 개발용 로컬 댓글 상태 관리
    const [devComments, setDevComments] = useState<CommentWithUser[]>([]);
    const [devReplies, setDevReplies] = useState<Record<string, CommentWithUser[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 댓글 작성 핸들러
    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert('로그인이 필요합니다. (테스트 로그인 버튼을 눌러주세요)');
            return;
        }

        if (!commentContent.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        // 로컬 상태에 댓글 추가 (뮤테이션 시뮬레이션)
        setIsSubmitting(true);

        setTimeout(() => {
            const newComment: CommentWithUser = {
                id: `dev-comment-${Date.now()}`,
                postId: postId,
                userId: dummyUser.id,
                parentId: null,
                content: commentContent,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: dummyUser
            };

            setDevComments(prevComments => [newComment, ...prevComments]);
            setCommentContent('');
            setIsSubmitting(false);
        }, 500); // 약간의 지연으로 로딩 시뮬레이션
    };

    // 답글 작성 핸들러
    const handleSubmitReply = (parentId: string) => {
        if (!isLoggedIn) {
            alert('로그인이 필요합니다. (테스트 로그인 버튼을 눌러주세요)');
            return;
        }

        if (!replyContent.trim()) {
            alert('답글 내용을 입력해주세요.');
            return;
        }

        // 로컬 상태에 답글 추가
        setIsSubmitting(true);

        setTimeout(() => {
            const newReply: CommentWithUser = {
                id: `dev-reply-${Date.now()}`,
                postId: postId,
                userId: dummyUser.id,
                parentId: parentId,
                content: replyContent,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: dummyUser
            };

            setDevReplies(prevReplies => ({
                ...prevReplies,
                [parentId]: [...(prevReplies[parentId] || []), newReply]
            }));

            setReplyContent('');
            setReplyingTo(null);
            setIsSubmitting(false);
        }, 500);
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = (commentId: string, isReply = false, parentId?: string) => {
        if (!isLoggedIn) {
            alert('로그인이 필요합니다. (테스트 로그인 버튼을 눌러주세요)');
            return;
        }

        if (confirm('댓글을 삭제하시겠습니까?')) {
            if (isReply && parentId) {
                // 답글 삭제
                setDevReplies(prevReplies => ({
                    ...prevReplies,
                    [parentId]: prevReplies[parentId]?.filter(reply => reply.id !== commentId) || []
                }));
            } else {
                // 댓글 삭제 (답글도 함께 삭제)
                setDevComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
                setDevReplies(prevReplies => {
                    const newReplies = { ...prevReplies };
                    delete newReplies[commentId];
                    return newReplies;
                });
            }
        }
    };

    // 최종 표시할 댓글 목록 (기존 댓글 + 개발용 댓글)
    const allComments = [...devComments, ...comments];
    const calculatedTotalComments = totalComments + devComments.length +
        Object.values(devReplies).reduce((acc, replies) => acc + replies.length, 0);

    return (
        <section className="mt-8">
            <h2 className="text-xl font-bold mb-6 flex items-center">
                <MessageSquare className="mr-2" size={20} />
                댓글 <span className="text-gray-500 ml-1">({calculatedTotalComments})</span>
            </h2>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} className="mb-8">
                <Textarea
                    placeholder={isLoggedIn ? '댓글을 작성해보세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="mb-2 min-h-24"
                    disabled={!isLoggedIn}
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={!isLoggedIn || isSubmitting}
                    >
                        {isSubmitting ? '등록 중...' : '댓글 등록'}
                    </Button>
                </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-6">
                {allComments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        첫 번째 댓글을 작성해보세요!
                    </div>
                ) : (
                    allComments.map((comment) => {
                        // 개발용으로 추가된 답글 가져오기
                        const devRepliesForComment = devReplies[comment.id] || [];
                        const allReplies = [...(devRepliesForComment || []), ...(comment.replies || [])];

                        return (
                            <div key={comment.id} className="border rounded-lg p-4">
                                {/* 댓글 헤더 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {comment.user.image ? (
                                            <Image
                                                src={comment.user.image}
                                                alt={comment.user.name || '사용자'}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {comment.user.name?.charAt(0) || 'U'}
                        </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium">
                                                {comment.user.name || '익명'}
                                                {comment.id.startsWith('dev-') && (
                                                    <span className="text-xs text-blue-500 ml-1">(개발 테스트)</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {format(new Date(comment.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 댓글 액션 메뉴 */}
                                    {isLoggedIn && comment.user.id === dummyUser.id && comment.id.startsWith('dev-') && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-500"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    <span>삭제</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                {/* 댓글 내용 */}
                                <div className="mt-2 text-gray-800 whitespace-pre-line">
                                    {comment.content}
                                </div>

                                {/* 답글 버튼 */}
                                {isLoggedIn && (
                                    <div className="mt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500"
                                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                        >
                                            <Reply size={14} className="mr-1" />
                                            답글
                                        </Button>
                                    </div>
                                )}

                                {/* 답글 작성 폼 */}
                                {replyingTo === comment.id && (
                                    <div className="mt-3 ml-8 border-l-2 border-gray-200 pl-4">
                                        <Textarea
                                            placeholder="답글을 작성해보세요..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="mb-2 min-h-20"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setReplyingTo(null)}
                                            >
                                                취소
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSubmitReply(comment.id)}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? '등록 중...' : '답글 등록'}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* 답글 목록 */}
                                {allReplies.length > 0 && (
                                    <div className="mt-4 ml-8 space-y-4 border-l-2 border-gray-200 pl-4">
                                        {allReplies.map((reply) => (
                                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                                                {/* 답글 헤더 */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {reply.user.image ? (
                                                            <Image
                                                                src={reply.user.image}
                                                                alt={reply.user.name || '사용자'}
                                                                width={24}
                                                                height={24}
                                                                className="rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 text-xs font-medium">
                                  {reply.user.name?.charAt(0) || 'U'}
                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-sm">
                                                                {reply.user.name || '익명'}
                                                                {reply.id.startsWith('dev-') && (
                                                                    <span className="text-xs text-blue-500 ml-1">(개발 테스트)</span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {format(new Date(reply.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 답글 액션 메뉴 */}
                                                    {isLoggedIn && reply.user.id === dummyUser.id && reply.id.startsWith('dev-') && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                    <MoreHorizontal size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    className="text-red-500 focus:text-red-500"
                                                                    onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                                                >
                                                                    <Trash className="mr-2 h-3 w-3" />
                                                                    <span>삭제</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>

                                                {/* 답글 내용 */}
                                                <div className="mt-1 text-gray-800 text-sm whitespace-pre-line">
                                                    {reply.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}
