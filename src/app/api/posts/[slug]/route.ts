// src/app/api/posts/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as blogService from '@/modules/blog/blog.service';
import { auth } from "@/auth";
import { PostDetail } from "@/modules/blog/blog.types";

/**
 * GET 요청 핸들러 - 포스트 상세 조회
 *
 * URL 예시: /api/posts/my-first-blog
 *
 * @param request Next.js 요청 객체
 * @param context 동적 라우트 컨텍스트
 * @returns NextResponse 응답 객체
 */
export async function GET(
    request: NextRequest,
    context: { params: { slug: string } }
) {
    try {
        const { slug } = context.params;

        // request 헤더에서 incrementView 쿼리 파라미터 확인
        const incrementView = request.nextUrl.searchParams.get('incrementView') === 'true';

        // 서비스 레이어 호출
        const postData = await blogService.getPostBySlug(slug, incrementView);

        // 성공 응답 반환
        return NextResponse.json(postData, { status: 200 });
    } catch (error) {
        console.error('포스트 상세 API 오류:', error);

        // 에러 메시지 추출
        const errorMessage = error instanceof Error
            ? error.message
            : '포스트를 불러오는 데 실패했습니다.';

        // 에러 응답 반환
        return NextResponse.json(
            { error: errorMessage },
            { status: error instanceof Error && error.message.includes('찾을 수 없습니다') ? 404 : 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    context: { params: { slug: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const { slug } = context.params;
        const formData = await request.formData(); // ❗ FormData 파싱

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const tagsRaw = formData.get('tags') as string;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        if (!title || !content) {
            return NextResponse.json({ error: "제목과 본문은 필수입니다." }, { status: 400 });
        }

        const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

        const updatedPost = await blogService.updatePost(session.user.id, {
            id: slug,
            title,
            content,
            tags,
            thumbnail: thumbnailFile ? `/uploads/${Date.now()}-${thumbnailFile.name}` : undefined
        });

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error('포스트 수정 오류:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '수정 실패' },
            { status: 500 }
        );
    }
}
export async function DELETE(
    request: NextRequest,
    context: { params: { slug: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const { slug } = context.params;

        // 먼저 slug로 포스트를 조회하여 id 얻기
        const post = await blogService.getPostBySlug(slug, false);
        if (!post) {
            return NextResponse.json({ error: "포스트를 찾을 수 없습니다." }, { status: 404 });
        }

        // 실제 id를 사용하여 삭제 진행
        const deletedPost = await blogService.deletePost(session.user.id, post.id);

        return NextResponse.json({ success: true, message: "게시글이 삭제되었습니다." }, { status: 200 });
    } catch (error) {
        console.error('포스트 삭제 오류:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '삭제 실패' },
            { status: error instanceof Error && error.message.includes('찾을 수 없습니다') ? 404 : 500 }
        );
    }
}
