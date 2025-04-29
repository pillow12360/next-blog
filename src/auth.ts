import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: 'read:user user:email'  // 이메일 접근 권한 추가
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    token.id = user.id;
                    token.role = (user as any).role ?? "USER"; // 기본 USER
                }
                return token;
            },
            async session({ session, token }) {
                if (session.user) {
                    session.user.id = token.id as string;
                    (session.user as any).role = token.role;
                }
                return session;
            },
        },
    pages: {
        signIn: '/login',
        error: '/login/error',  // 에러 페이지 추가
    },
    debug: process.env.NODE_ENV === 'development',  // 개발 환경에서 디버깅 활성화
});
