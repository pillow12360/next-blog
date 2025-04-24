// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: 'USER' | 'ADMIN'; // enum Role과 맞춰줌
        } & DefaultSession['user'];
    }

    interface User {
        role: 'USER' | 'ADMIN';
    }

    interface JWT {
        id: string;
        role: 'USER' | 'ADMIN';
    }
}
