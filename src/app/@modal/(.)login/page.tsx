// src/app/(.)login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function LoginModal() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    // 중요: 모달이 열릴 때 URL을 기억해두고,
    // 이를 callbackUrl로 사용해 로그인 후 원래 페이지로 돌아가도록 함
    const callbackUrl = typeof window !== 'undefined'
        ? window.location.pathname
        : '/';

    useEffect(() => {
        // 스크롤 방지
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <Dialog open onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">로그인</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                    <p className="text-center text-muted-foreground text-sm">
                        소셜 계정으로 간편하게 로그인하세요
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => signIn("github", { callbackUrl })}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Github size={18} />
                        GitHub로 로그인
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
