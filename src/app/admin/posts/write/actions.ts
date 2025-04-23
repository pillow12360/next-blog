'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createNewPost } from '@/modules/blog/blog.api';
import { uploadImageToStorage } from '@/lib/utils';

// 더미 세션 데이터 (인증 시스템 구현 전 임시 사용)
const dummySession = {
    user: {
        id: 'admin-user-123',  // 실제 DB에 존재하는 유효한 ID여야 함
        name: '관리자',
        email: 'admin@example.com',
        role: 'ADMIN',
        image: '/placeholder-avatar.jpg'
    }
};

/**
 * 게시글 작성 서버 액션
 * Form에서 전송된 데이터를 처리하고 게시글을 생성합니다.
 *
 * @param formData - 폼 데이터
 * @returns 성공 시 리디렉션, 실패 시 에러 메시지 반환
 */
export async function createPost(formData: FormData) {
    try {
        // 실제 인증 대신 더미 세션 사용
        const session = dummySession;

        if (!session || !session.user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        if (session.user.role !== 'ADMIN') {
            return { success: false, error: '관리자만 게시글을 작성할 수 있습니다.' };
        }

        // 폼 데이터 추출
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const tagsString = formData.get('tags') as string;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        // 필수 값 검증
        if (!title || !content) {
            return { success: false, error: '제목과 내용은 필수 입력 항목입니다.' };
        }

        // 태그 처리
        let tags: string[] = [];
        if (tagsString) {
            try {
                tags = JSON.parse(tagsString);
            } catch (e) {
                console.error('태그 파싱 오류:', e);
                return { success: false, error: '태그 형식이 올바르지 않습니다.' };
            }
        }

        // 썸네일 이미지 처리
        let thumbnail: string | undefined = undefined;  // null 대신 undefined 사용
        if (thumbnailFile && thumbnailFile.size > 0) {
            // 파일 크기 제한 (2MB)
            if (thumbnailFile.size > 2 * 1024 * 1024) {
                return { success: false, error: '이미지 크기는 최대 2MB까지 허용됩니다.' };
            }

            // 파일 확장자 검증
            const fileType = thumbnailFile.type;
            if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(fileType)) {
                return { success: false, error: '지원되는 이미지 형식은 JPG, PNG, GIF, WEBP입니다.' };
            }

            try {
                // 이미지 업로드 (실제 구현은 별도 유틸리티 함수로 분리)
                thumbnail = await uploadImageToStorage(thumbnailFile);
            } catch (error) {
                console.error('이미지 업로드 오류:', error);
                return { success: false, error: '이미지 업로드에 실패했습니다.' };
            }
        }

        console.log('게시글 생성 시도:', {
            userId: session.user.id,
            title,
            content: content.substring(0, 100) + '...',  // 로그에는 일부만 출력
            tags,
            hasThumbnail: !!thumbnail
        });

        // 게시글 생성 API 호출
        const post = await createNewPost(session.user.id, {
            title,
            content,
            tags,
            thumbnail  // null 대신 undefined가 전달됨
        });

        console.log('게시글 생성 성공:', { postId: post.id, slug: post.slug });

        // 캐시 무효화 (게시글 목록 페이지와 메인 페이지)
        revalidatePath('/blog');
        revalidatePath('/admin/posts');

        // 성공 시 게시글 목록 페이지로 리디렉션
        redirect('/admin/posts');
    } catch (error) {
        console.error('게시글 생성 오류:', error);
        return { success: false, error: '게시글 저장 중 오류가 발생했습니다. 다시 시도해주세요.' };
    }
}

/**
 * 임시 저장 서버 액션 (향후 구현)
 * 작성 중인 게시글을 임시 저장합니다.
 */
export async function saveDraft(formData: FormData) {
    try {
        // 더미 세션 사용
        const session = dummySession;

        if (!session || !session.user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        // 폼 데이터 추출
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        console.log('임시 저장:', {
            userId: session.user.id,
            title,
            contentLength: content?.length || 0
        });

        // 임시 저장 로직 구현 (예: localStorage 또는 DB에 draft 상태로 저장)
        // ...

        return { success: true, message: '임시 저장되었습니다.' };
    } catch (error) {
        console.error('임시 저장 오류:', error);
        return { success: false, error: '임시 저장에 실패했습니다.' };
    }
}
