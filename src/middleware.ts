// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // 인증이 필요한 경로들 (정규식으로 더 복잡하게 만들 수도 있음)
    const authRequiredPaths = ['/dashboard', '/profile'];
    const isAuthRequiredPath = authRequiredPaths.some(path =>
        pathname.startsWith(path)
    );

    // 관리자 전용 경로
    const isAdminPath = pathname.startsWith('/admin');

    // 로그인 페이지로 리다이렉트할 URL 준비
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);

    // 관리자 경로에 대한 체크
    if (isAdminPath) {
        // 로그인하지 않았거나 관리자가 아니면 리다이렉트
        if (!token || token.role !== 'ADMIN') {
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // 일반적인 인증 필요 경로 체크
    if (isAuthRequiredPath && !token) {
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/admin/:path*'
    ],
};
