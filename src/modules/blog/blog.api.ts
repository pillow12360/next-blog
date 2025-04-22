// src/modules/blog/blog.api.ts
import * as service from './blog.service';
import {
    CreatePostInput,
    UpdatePostInput,
    CreateCommentInput,
    PostInteractionInput,
    PostSearchFilter
} from './blog.types';

/**
 * 포스트 목록 가져오는 API 함수
 */
export async function fetchPosts(filter: PostSearchFilter = {}) {
    try {
        return await service.getPosts(filter);
    } catch (error) {
        console.error('API 오류 - 포스트 목록 조회:', error);
        throw new Error('포스트 목록을 불러오는 데 실패했습니다.');
    }
}

/**
 * 슬러그로 단일 포스트를 가져오는 API 함수
 */
export async function fetchPostBySlug(slug: string, incrementView = false) {
    try {
        return await service.getPostBySlug(slug, incrementView);
    } catch (error) {
        console.error('API 오류 - 포스트 상세 조회:', error);
        throw error;
    }
}

/**
 * 새 포스트 생성 API 함수
 */
export async function createNewPost(userId: string, data: CreatePostInput) {
    try {
        return await service.createPost(userId, data);
    } catch (error) {
        console.error('API 오류 - 포스트 생성:', error);
        throw error;
    }
}

/**
 * 포스트 업데이트 API 함수
 */
export async function updateExistingPost(userId: string, data: UpdatePostInput) {
    try {
        return await service.updatePost(userId, data);
    } catch (error) {
        console.error('API 오류 - 포스트 업데이트:', error);
        throw error;
    }
}

/**
 * 포스트 삭제 API 함수
 */
export async function deleteExistingPost(userId: string, postId: string) {
    try {
        return await service.deletePost(userId, postId);
    } catch (error) {
        console.error('API 오류 - 포스트 삭제:', error);
        throw error;
    }
}

/**
 * 댓글 작성 API 함수
 */
export async function postComment(userId: string, data: CreateCommentInput) {
    try {
        return await service.createComment(userId, data);
    } catch (error) {
        console.error('API 오류 - 댓글 작성:', error);
        throw error;
    }
}

/**
 * 댓글 삭제 API 함수
 */
export async function removeComment(userId: string, commentId: string) {
    try {
        return await service.deleteComment(userId, commentId);
    } catch (error) {
        console.error('API 오류 - 댓글 삭제:', error);
        throw error;
    }
}

/**
 * 좋아요를 토글하는 API 함수
 */
export async function togglePostLike(userId: string, data: PostInteractionInput) {
    try {
        return await service.toggleLike(userId, data);
    } catch (error) {
        console.error('API 오류 - 좋아요 토글:', error);
        throw error;
    }
}

/**
 * 북마크를 토글하는 API 함수
 */
export async function togglePostBookmark(userId: string, data: PostInteractionInput) {
    try {
        return await service.toggleBookmark(userId, data);
    } catch (error) {
        console.error('API 오류 - 북마크 토글:', error);
        throw error;
    }
}

/**
 * 사용자 상호작용 정보를 가져오는 API 함수
 */
export async function fetchUserInteractions(userId: string, postId: string) {
    try {
        return await service.getUserInteractions(userId, postId);
    } catch (error) {
        console.error('API 오류 - 사용자 상호작용 조회:', error);
        throw error;
    }
}

/**
 * 태그 목록을 가져오는 API 함수
 */
export async function fetchTags() {
    try {
        return await service.getTags();
    } catch (error) {
        console.error('API 오류 - 태그 목록 조회:', error);
        throw error;
    }
}

/**
 * 관련 포스트를 가져오는 API 함수
 */
export async function fetchRelatedPosts(postId: string, limit = 3) {
    try {
        return await service.getRelatedPosts(postId, limit);
    } catch (error) {
        console.error('API 오류 - 관련 포스트 조회:', error);
        throw error;
    }
}
