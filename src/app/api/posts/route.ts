import { NextRequest, NextResponse } from 'next/server';
import * as blogService from '@/modules/blog/blog.service';
import { PostSearchFilter } from '@/modules/blog/blog.types';

/**
 * GET 요청 핸들러 - 포스트 목록 조회
 *
 * URL 예시: /api/posts?page=1&limit=10&keyword=nextjs&tag=frontend&sortBy=latest
 *
 * @param request Next.js 요청 객체
 * @returns NextResponse 응답 객체
 */
export async function GET(request: NextRequest) {
    try {
        // URL 쿼리 파라미터 추출
        const searchParams = request.nextUrl.searchParams;

        // 필터 객체 구성
        const filter: PostSearchFilter = {
            keyword: searchParams.get('keyword') || '',
            tag: searchParams.get('tag') || '',
            // 숫자형 파라미터는 parseInt로 변환, 기본값 설정
            page: parseInt(searchParams.get('page') || '1', 10),
            limit: parseInt(searchParams.get('limit') || '10', 10),
            // sortBy는 타입 체크 후 할당
            sortBy: (searchParams.get('sortBy') as 'latest' | 'popular' | 'comments') || 'latest'
        };

        // 서비스 레이어 호출
        const postsData = await blogService.getPosts(filter);

        // 성공 응답 반환
        return NextResponse.json(postsData, { status: 200 });
    } catch (error) {
        console.error('포스트 목록 API 오류:', error);

        // 에러 응답 반환
        return NextResponse.json(
            { error: '포스트 목록을 불러오는 데 실패했습니다.' },
            { status: 500 }
        );
    }
}
