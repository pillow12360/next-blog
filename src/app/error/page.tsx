// app/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || '오류가 발생했습니다.';
    const code = searchParams.get('code') || 'ERROR';

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold mb-2">오류가 발생했습니다</h1>
                <div className="text-sm inline-block bg-red-100 px-3 py-1 rounded-full mb-4">
                    코드: {code}
                </div>

                <p className="text-gray-600 mb-8">{message}</p>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        이전 페이지로
                    </Button>
                    <Button onClick={() => window.location.href = '/'}>
                        홈으로 이동
                    </Button>
                </div>
            </div>
        </div>
    );
}
