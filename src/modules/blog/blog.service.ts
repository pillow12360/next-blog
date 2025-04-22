// src/modules/blog/blog.service.ts
import * as repository from './blog.repository';
import {
    CreatePostInput,
    UpdatePostInput,
    CreateCommentInput,
    PostInteractionInput,
    PostSearchFilter
} from './blog.types';

/**
 * 포스트 목록 조회
 */
export async function getPosts(filter: PostSearchFilter = {}) {
    try {
        return await repository.findPosts(filter);
    } catch (error) {
        console.error('포스트 목록 조회 오류:', error);
        throw new Error('포스트 목록을 불러오는 데 실패했습니다.');
    }
}

/**
 * slug로 포스트 상세 조회
 */
export async function getPostBySlug(slug: string, incrementView = false) {
    try {
        const post = await repository.findPostBySlug(slug, incrementView);

        if (!post) {
            throw new Error('포스트를 찾을 수 없습니다.');
        }

        return post;
    } catch (error) {
        console.error('포스트 상세 조회 오류:', error);
        throw error;
    }
}

/**
 * 포스트 생성 (권한 검증 포함)
 */
export async function createPost(userId: string, data: CreatePostInput) {
    try {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        // 유효성 검사
        if (!data.title || !data.content) {
            throw new Error('제목과 내용은 필수 입력 항목입니다.');
        }

        return await repository.createPostInDb(userId, data);
    } catch (error) {
        console.error('포스트 생성 오류:', error);
        throw error;
    }
}

/**
 * 포스트 업데이트 (권한 검증 포함)
 */
export async function updatePost(userId: string, data: UpdatePostInput) {
    try {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        return await repository.updatePostInDb(userId, data);
    } catch (error) {
        console.error('포스트 업데이트 오류:', error);
        throw error;
    }
}

/**
 * 포스트 삭제 (권한 검증 포함)
 */
export async function deletePost(userId: string, postId: string) {
    try {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        return await repository.deletePostFromDb(userId, postId);
    } catch (error) {
        console.error('포스트 삭제 오류:', error);
        throw error;
    }
}

/**
 * 댓글 생성
 */
export async function createComment(userId: string, data: CreateCommentInput) {
    try {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        if (!data.content) {
            throw new Error('댓글 내용은 필수 입력 항목입니다.');
        }

        return await repository.createCommentInDb(userId, data);
    } catch (error) {
        console.error('댓글 생성 오류:', error);
        throw error;
    }
}

/**
 * 댓글 삭제
 */
export async function deleteComment(userId: string, commentId: string) {
    try {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        return await repository.deleteCommentFromDb(userId, commentId);
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        throw error;
    }
}

/**
 * 좋아요 토글
 */
export async function toggleLike(userId: string, data: PostInteractionInput) {
    try {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        return await repository.toggleLikeInDb(userId, data);
    } catch (error) {
        console.error('좋아요 토글 오류:', error);
        throw new Error('좋아요 처리에 실패했습니다.');
    }
}

/**
 * 북마크 토글
 */
export async function toggleBookmark(userId: string, data: PostInteractionInput) {
    try {
        if (!userId) {
            throw new Error('로그인이 필요합니다.');
        }

        return await repository.toggleBookmarkInDb(userId, data);
    } catch (error) {
        console.error('북마크 토글 오류:', error);
        throw new Error('북마크 처리에 실패했습니다.');
    }
}

/**
 * 사용자 상호작용 정보 조회
 */
export async function getUserInteractions(userId: string, postId: string) {
    try {
        if (!userId) {
            return { liked: false, bookmarked: false, postId };
        }

        return await repository.findUserInteractions(userId, postId);
    } catch (error) {
        console.error('사용자 상호작용 조회 오류:', error);
        throw new Error('상호작용 정보를 불러오는 데 실패했습니다.');
    }
}

/**
 * 인기 태그 목록 조회
 */
export async function getTags() {
    try {
        return await repository.findTags();
    } catch (error) {
        console.error('태그 목록 조회 오류:', error);
        throw new Error('태그 목록을 불러오는 데 실패했습니다.');
    }
}

/**
 * 관련 포스트 조회
 */
export async function getRelatedPosts(postId: string, limit = 3) {
    try {
        return await repository.findRelatedPosts(postId, limit);
    } catch (error) {
        console.error('관련 포스트 조회 오류:', error);
        throw new Error('관련 포스트를 불러오는 데 실패했습니다.');
    }
}
