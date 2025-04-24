'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createNewPost } from '@/modules/blog/blog.api';
import { uploadImageToStorage } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

// 더미 세션 데이터 (인증 시스템 구현 전 임시 사용)
const dummySession = {
    user: {
        email: 'admin@example.com',
        name: '관리자',
        role: 'ADMIN',
        image: '/placeholder-avatar.jpg'
    }
};

/**
 * 게시글 작성 서버 액션
 */
export async function createPost(formData: FormData) {
    try {
        // 실제 인증 대신 더미 세션 사용
        const session = dummySession;

        if (!session || !session.user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        // admin@example.com 계정이 존재하지 않으면 자동 생성
        const user = await prisma.user.upsert({
            where: { email: session.user.email },
            update: {}, // 이미 존재하면 업데이트 없음
            create: {
                email: session.user.email,
                name: session.user.name || '관리자',
                image: session.user.image,
                role: 'ADMIN',
            },
        });

        console.log('사용자 정보:', {
            id: user.id,
            email: user.email,
            role: user.role
        });

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
        let thumbnail: string | undefined = undefined;
        if (thumbnailFile && thumbnailFile.size > 0) {
            console.log('이미지 업로드 시뮬레이션:', {
                name: thumbnailFile.name,
                size: thumbnailFile.size,
                type: thumbnailFile.type
            });

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
                // 실제 환경에서는 이미지 업로드 로직 구현
                // 현재는 테스트를 위해 가상 URL 반환
                thumbnail = `/uploads/${Date.now()}-${thumbnailFile.name}`;
                console.log('이미지 업로드 성공 (시뮬레이션):', thumbnail);
            } catch (error) {
                console.error('이미지 업로드 오류:', error);
                return { success: false, error: '이미지 업로드에 실패했습니다.' };
            }
        }

        // 여기가 중요! user.id 값 확인 및 사용
        console.log('게시글 생성 시도:', {
            userId: user.id, // user.id가 유효한지 확인
            title,
            content: content.substring(0, 100) + '...',
            tags,
            hasThumbnail: !!thumbnail
        });

        if (!user.id) {
            console.error('사용자 ID가 유효하지 않음:', user);
            return { success: false, error: '사용자 정보가 유효하지 않습니다.' };
        }

        // 게시글 생성 API 호출 - user.id 전달
        const post = await createNewPost(user.id, {
            title,
            content,
            tags,
            thumbnail
        });

        console.log('게시글 생성 성공:', { postId: post.id, slug: post.slug });

        // 캐시 무효화
        revalidatePath('/blog');
        revalidatePath('/admin/posts');

        return {
            success: true,
            postId: post.id,
            slug: post.slug
        };
    } catch (error) {
        console.error('게시글 생성 오류:', error);

        // 더 자세한 에러 정보를 클라이언트에 반환
        const errorMessage =
            error instanceof Error
                ? `게시글 저장 중 오류가 발생했습니다: ${error.message}`
                : '게시글 저장에 실패했습니다';

        return { success: false, error: errorMessage };
    }
}

/**
 * 임시 저장 서버 액션
 */
export async function saveDraft(formData: FormData) {
    try {
        // 더미 세션 사용
        const session = dummySession;

        if (!session || !session.user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        // 사용자 확인
        const user = await prisma.user.upsert({
            where: { email: session.user.email },
            update: {},
            create: {
                email: session.user.email,
                name: session.user.name || '관리자',
                image: session.user.image,
                role: 'ADMIN',
            },
        });

        // 폼 데이터 추출
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        console.log('임시 저장:', {
            userId: user.id,
            title,
            contentLength: content?.length || 0
        });

        // TODO: 실제 임시 저장 로직 구현
        // 현재는 성공 메시지만 반환
        return { success: true, message: '임시 저장되었습니다.' };
    } catch (error) {
        console.error('임시 저장 오류:', error);
        return { success: false, error: '임시 저장에 실패했습니다.' };
    }
}
