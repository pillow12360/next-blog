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
    callbacks: {
        async signIn({ user, account, profile }) {
            // 디버깅용 로그 추가
            console.log('로그인 시도:', {
                user,
                accountType: account?.provider
            });

            // 이메일이 없어도 로그인 허용
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
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
