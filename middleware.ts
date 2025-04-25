// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
    // 새로운 auth() 함수 사용
    const session = await auth();
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

    console.log("미들웨어 실행:", request.nextUrl.pathname);
    console.log("세션 상태:", !!session);

    // 관리자 경로 보호
    if (isAdminRoute && !session) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

        console.log("인증 실패, 리디렉션:", loginUrl.toString());
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
