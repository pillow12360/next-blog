// src/modules/blog/blog.hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchPosts,
    fetchPostBySlug,
    createNewPost,
    updateExistingPost,
    deleteExistingPost,
    postComment,
    removeComment,
    togglePostLike,
    togglePostBookmark,
    fetchUserInteractions,
    fetchTags,
    fetchRelatedPosts
} from './blog.api';

import {
    CreatePostInput,
    UpdatePostInput,
    CreateCommentInput,
    PostInteractionInput,
    PostDetail,
    PostListItem,
    PostSearchFilter,
    PostsResponse
} from './blog.types';

interface RelatedPostsResponse {
    posts: PostListItem[];
    success: boolean;
}

/**
 * 포스트 목록을 가져오는 훅
 */
export function usePosts(filter: PostSearchFilter = {}) {
    return useQuery<PostsResponse>({
        queryKey: ['posts', filter],
        queryFn: () => fetchPosts(filter),
    });
}

/**
 * 포스트 상세 정보를 가져오는 훅
 */
export function usePost(slug: string, incrementView = false) {
    return useQuery<PostDetail>({
        queryKey: ['post', slug],
        queryFn: () => fetchPostBySlug(slug, incrementView),
        enabled: !!slug, // slug가 있을 때만 쿼리 실행
    });
}

/**
 * 관련 포스트를 가져오는 훅
 */
export function useRelatedPosts(postId: string, limit = 3) {
    return useQuery<PostListItem[]>({
        queryKey: ['relatedPosts', postId],
        queryFn: async () => {
            try {
                const result = await fetchRelatedPosts(postId, limit);
                return result || []; // 결과가 없을 경우 빈 배열 반환
            } catch (error) {
                console.error('관련 포스트 조회 실패:', error);
                return []; // 에러 발생해도 빈 배열 반환하여 UI 깨짐 방지
            }
        },
        enabled: Boolean(postId), // !!postId와 동일하지만 더 명시적
        staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    });
}

/**
 * 태그 목록을 가져오는 훅
 */
export function useTags() {
    return useQuery({
        queryKey: ['tags'],
        queryFn: fetchTags,
    });
}

/**
 * 포스트 생성 훅
 */
export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: CreatePostInput }) =>
            createNewPost(userId, data),
        onSuccess: () => {
            // 포스트 목록 캐시 무효화하여 새로고침
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

/**
 * 포스트 수정 훅
 */
export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdatePostInput }) =>
            updateExistingPost(userId, data),
        onSuccess: (updatedPost) => {
            // 해당 포스트와 포스트 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['post', updatedPost.slug] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

/**
 * 포스트 삭제 훅
 */
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
            deleteExistingPost(userId, postId),
        onSuccess: () => {
            // 포스트 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

/**
 * 댓글 작성 훅
 */
export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: CreateCommentInput }) =>
            postComment(userId, data),
        onSuccess: (_, { data }) => {
            // 해당 포스트의 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ['post'],
                predicate: (query) => {
                    // 특정 포스트의 쿼리만 무효화
                    if (query.queryKey.length > 1 && data.postId) {
                        const postDetails = queryClient.getQueryData(['post', data.postId]);
                        return !!postDetails;
                    }
                    return false;
                }
            });
        },
    });
}

/**
 * 댓글 삭제 훅
 */
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, commentId, postId }: { userId: string; commentId: string; postId?: string }) =>
            removeComment(userId, commentId),
        onSuccess: (_, { postId }) => {
            // postId가 있으면 해당 포스트만 무효화, 없으면 모든 포스트 무효화
            if (postId) {
                queryClient.invalidateQueries({
                    queryKey: ['post'],
                    predicate: (query) => {
                        const slug = queryClient.getQueryData(['post', postId, 'slug']);
                        return query.queryKey[1] === slug;
                    }
                });
            } else {
                queryClient.invalidateQueries({ queryKey: ['post'] });
            }
        },
    });
}

/**
 * 좋아요 토글 훅
 */
export function useToggleLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
            togglePostLike(userId, { postId }),
        onSuccess: (result) => {
            // 해당 포스트와 상호작용 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ['post'],
                predicate: (query) => {
                    if (query.queryKey.length > 1) {
                        const post = queryClient.getQueryData<PostDetail>(query.queryKey);
                        return post?.id === result.postId;
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: ['userInteractions', result.postId] });
        },
    });
}

/**
 * 북마크 토글 훅
 */
export function useToggleBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
            togglePostBookmark(userId, { postId }),
        onSuccess: (result) => {
            // 해당 포스트와 상호작용 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ['post'],
                predicate: (query) => {
                    if (query.queryKey.length > 1) {
                        const post = queryClient.getQueryData<PostDetail>(query.queryKey);
                        return post?.id === result.postId;
                    }
                    return false;
                }
            });
            queryClient.invalidateQueries({ queryKey: ['userInteractions', result.postId] });
        },
    });
}

/**
 * 사용자 상호작용(좋아요, 북마크) 조회 훅
 */
export function useUserInteractions(userId: string, postId: string) {
    return useQuery({
        queryKey: ['userInteractions', postId],
        queryFn: () => fetchUserInteractions(userId, postId),
        enabled: !!userId && !!postId, // userId와 postId가 있을 때만 쿼리 실행
    });
}
