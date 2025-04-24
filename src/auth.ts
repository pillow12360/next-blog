import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { Provider } from "next-auth/providers"

export const { handlers, auth } = NextAuth({
    providers: [GitHub],
    pages: {
        signIn: "/login",
    },
})
