'use server';

import { revalidatePath } from 'next/cache';
import { createNewPost } from '@/modules/blog/blog.api';
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";
import { cookies } from 'next/headers';
import {redirect} from "next/navigation";

/**
 * 테스트용 간단한 서버 액션 - Promise<void> 반환
 */
export async function testPost(formData: FormData): Promise<void> {
    console.log('테스트 서버 액션 실행!');

    // 폼 데이터 디버깅
    console.log('폼 데이터 내용:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? '파일' : value}`);
    }

    // 세션 확인
    const session = await auth();
    console.log('세션 정보:', session ? '있음' : '없음');

    if (!session || !session.user) {
        console.log('인증 안됨!');
        return; // 리다이렉트 없이 단순 반환
    }

    console.log('인증됨!');
    console.log('사용자:', session.user.email);

    // 특별한 작업 없이 반환
    return;
}

/**
 * 게시글 작성 서버 액션 - Promise<void> 반환
 */
export async function createPost(formData: FormData): Promise<void> {
    console.log('서버 액션 실행됨!');


        // 쿠키 확인 (디버깅용)
        const cookieStore = cookies();

        // 세션 확인
        const session = await auth();
        console.log('세션 정보:', session ? '있음' : '없음');

        if (!session || !session.user) {
            console.log('인증 실패: 세션 또는 사용자 정보 없음');
            return; // 리다이렉트 없이 단순 반환
        }

        // 사용자 정보 가져오기
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

        console.log('데이터 확인:');
        console.log('- 제목:', title);
        console.log('- 내용 길이:', content?.length || 0);
        console.log('- 태그 문자열:', tagsString);
        console.log('- 썸네일:', thumbnailFile ? '있음' : '없음');

        // 필수 값 검증
        if (!title || !content) {
            console.log('필수 값 누락:', { title: !!title, content: !!content });
            return; // 에러 상황에서 단순 반환
        }

        // 태그 처리
        let tags: string[] = [];
        if (tagsString) {
            try {
                tags = JSON.parse(tagsString);
                console.log('파싱된 태그:', tags);
            } catch (e) {
                console.error('태그 파싱 오류:', e);
                return; // 에러 상황에서 단순 반환
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
                return; // 에러 상황에서 단순 반환
            }

            // 파일 확장자 검증
            const fileType = thumbnailFile.type;
            if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(fileType)) {
                return; // 에러 상황에서 단순 반환
            }

            try {
                // 실제 환경에서는 이미지 업로드 로직 구현
                // 현재는 테스트를 위해 가상 URL 반환
                thumbnail = `/uploads/${Date.now()}-${thumbnailFile.name}`;
                console.log('이미지 업로드 성공 (시뮬레이션):', thumbnail);
            } catch (error) {
                console.error('이미지 업로드 오류:', error);
                return; // 에러 상황에서 단순 반환
            }
        }

        // 여기가 중요! user.id 값 확인 및 사용
        console.log('게시글 생성 시도:', {
            userId: user.id, // user.id가 유효한지 확인
            title,
            contentLength: content.length,
            tags,
            hasThumbnail: !!thumbnail
        });

        if (!user.id) {
            console.error('사용자 ID가 유효하지 않음:', user);
            return; // 에러 상황에서 단순 반환
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

        // 성공 시 단순 반환
        redirect('/blog')
}

/**
 * 임시 저장 서버 액션 - 클라이언트에서 호출되는 경우에는 값 반환 가능
 */
export async function saveDraft(formData: FormData) {
    console.log('임시 저장 서버 액션 실행!');

    try {
        // 세션 확인
        const session = await auth();

        if (!session || !session.user) {
            // 임시 저장은 클라이언트에서 처리하므로 반환값을 유지
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
        // 반환값을 유지 (클라이언트에서 useTransition으로 호출하므로)
        return { success: true, message: '임시 저장되었습니다.' };
    } catch (error) {
        console.error('임시 저장 오류:', error);
        if (error instanceof Error) {
            console.error('에러 스택:', error.stack);
        }
        return { success: false, error: '임시 저장에 실패했습니다.' };
    }
}
