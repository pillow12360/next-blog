// src/app/login/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-xl">로그인</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <p className="text-center text-muted-foreground text-sm">
                            소셜 계정으로 간편하게 로그인하세요
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => signIn("github", { callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Github size={18} />
                            GitHub로 로그인
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
