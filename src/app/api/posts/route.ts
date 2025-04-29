import { NextRequest, NextResponse } from 'next/server';
import * as blogService from '@/modules/blog/blog.service';
import { PostSearchFilter } from '@/modules/blog/blog.types';
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";

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
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ errorType: '403', message: '인증정보를 찾을 수 없습니다.' }, { status: 403 });
        }

        // 📛 여기 수정
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const tagsString = formData.get('tags') as string;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        // 태그 파싱
        let tags: string[] = [];
        if (tagsString) {
            try {
                tags = JSON.parse(tagsString);
            } catch {
                tags = [];
            }
        }

        console.log("폼 데이터 파싱 성공", { title, content, tags });

        // 검증
        if (!title || !content) {
            return NextResponse.json({ errorType: '400', message: '입력값이 유효하지 않습니다.' }, { status: 400 });
        }

        // 비즈니스 로직 호출
        const post = await blogService.createPost(session.user.id, {
            title,
            content,
            tags,
            thumbnail: undefined, // 아직 업로드는 생략 (파일 저장 구현 필요)
        });

        return NextResponse.json({ success: true, post }, { status: 201 });

    } catch (error) {
        console.error("게시글 생성 에러:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
