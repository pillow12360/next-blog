"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    AlertCircle,
    X,
    RefreshCw,
    Home,
    ChevronLeft,
    Ban,
    ShieldAlert,
    ServerCrash,
    FileWarning
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ErrorMetaData {
    code: string;
    title: string;
    description: string;
    action: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    redirectTo?: string;
    refreshPage?: boolean;
    goBack?: boolean;
}
/**
 * 에러 코드별 메타데이터
 */
const ERROR_METADATA  = {
    "not-found": {
        code: "404",
        title: "페이지를 찾을 수 없습니다",
        description: "요청하신 페이지를 찾을 수 없습니다. URL을 확인하거나 홈으로 이동하세요.",
        action: "홈으로 이동",
        icon: FileWarning,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900/20",
        redirectTo: "/"
    },
    "unauthorized": {
        code: "401",
        title: "인증이 필요합니다",
        description: "이 페이지에 접근하려면 로그인이 필요합니다.",
        action: "로그인하기",
        icon: Ban,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/20",
        redirectTo: "/login"
    },
    "forbidden": {
        code: "403",
        title: "접근 권한이 없습니다",
        description: "이 페이지에 접근할 권한이 없습니다.",
        action: "홈으로 이동",
        icon: ShieldAlert,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        redirectTo: "/"
    },
    "server-error": {
        code: "500",
        title: "서버 오류가 발생했습니다",
        description: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        action: "새로고침",
        icon: ServerCrash,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        refreshPage: true
    },
    "validation-error": {
        code: "422",
        title: "입력 데이터 오류",
        description: "입력하신 데이터가 유효하지 않습니다. 다시 확인해주세요.",
        action: "돌아가기",
        icon: AlertCircle,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
        goBack: true
    },
    "default": {
        code: "오류",
        title: "오류가 발생했습니다",
        description: "알 수 없는 오류가 발생했습니다. 다시 시도하거나 관리자에게 문의하세요.",
        action: "돌아가기",
        icon: AlertCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        goBack: true
    },
};

/**
 * 에러 모달 페이지
 * URL 형식: /error?type=not-found&message=페이지를 찾을 수 없습니다
 */
export default function ErrorModal() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL에서 에러 정보 가져오기
    const errorType = searchParams.get('type') || 'default';
    const customMessage = searchParams.get('message');
    const customTitle = searchParams.get('title');
    const customCode = searchParams.get('code');
    const redirectUrl = searchParams.get('redirectUrl');

    // 에러 메타데이터 설정
    const errorMeta = (errorType in ERROR_METADATA
        ? ERROR_METADATA[errorType as keyof typeof ERROR_METADATA]
        : ERROR_METADATA.default) as ErrorMetaData;

// 커스텀 메타데이터로 덮어쓰기
    const meta: ErrorMetaData = {
        ...errorMeta,
        title: customTitle || errorMeta.title,
        description: customMessage || errorMeta.description,
        code: customCode || errorMeta.code,
        redirectTo: redirectUrl || errorMeta.redirectTo
    };

    const IconComponent = meta.icon;

    // 닫기 및 액션 핸들러
    const handleClose = useCallback(() => {
        router.back();
    }, [router]);

    const handleAction = useCallback(() => {
        if (meta.refreshPage) {
            window.location.reload();
        } else if (meta.goBack) {
            router.back();
        } else if (meta.redirectTo) {
            router.push(meta.redirectTo);
        } else {
            router.back();
        }
    }, [meta, router]);

    // ESC 키 이벤트 처리
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [handleClose]);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 ${meta.bgColor} rounded-full flex items-center justify-center mb-4`}>
                        <IconComponent className={`h-8 w-8 ${meta.color}`} />
                    </div>
                    <Badge variant="outline" className="mb-2 font-mono">
                        {meta.code}
                    </Badge>
                    <DialogTitle className="text-xl md:text-2xl mt-2">
                        {meta.title}
                    </DialogTitle>
                    <DialogDescription className="text-center mt-2">
                        {meta.description}
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <DialogFooter className="flex sm:flex-row sm:justify-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex items-center gap-1"
                    >
                        <X size={16} />
                        닫기
                    </Button>
                    <Button
                        onClick={handleAction}
                        className="flex items-center gap-1"
                    >
                        {meta.refreshPage ? (
                            <RefreshCw size={16} />
                        ) : meta.redirectTo === "/" ? (
                            <Home size={16} />
                        ) : (
                            <ChevronLeft size={16} />
                        )}
                        {meta.action}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
