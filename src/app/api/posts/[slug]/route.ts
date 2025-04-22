// src/app/api/posts/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as blogService from '@/modules/blog/blog.service';

/**
 * GET 요청 핸들러 - 포스트 상세 조회
 *
 * URL 예시: /api/posts/my-first-blog
 *
 * @param request Next.js 요청 객체
 * @param params 동적 라우트 파라미터 (slug)
 * @returns NextResponse 응답 객체
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

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
