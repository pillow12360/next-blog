'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

export default function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    // 에러 메시지 매핑
    const errorMessages: Record<string, { title: string, description: string }> = {
        'EmailRequired': {
            title: '이메일 접근 필요',
            description: 'GitHub 계정에 공개 이메일이 설정되어 있지 않습니다. GitHub 설정에서 이메일을 공개로 변경하거나, 로그인 설정을 확인해주세요.'
        },
        'AccessDenied': {
            title: '접근 거부됨',
            description: '로그인이 거부되었습니다. GitHub 계정에 이메일이 설정되어 있는지 확인해주세요.'
        },
        'Verification': {
            title: '인증 오류',
            description: '인증 과정에서 문제가 발생했습니다. 다시 시도해주세요.'
        },
        'OAuthSignin': {
            title: 'OAuth 로그인 오류',
            description: 'OAuth 로그인 과정에서 문제가 발생했습니다. 다시 시도해주세요.'
        },
        'OAuthCallback': {
            title: 'OAuth 콜백 오류',
            description: 'OAuth 로그인 콜백 과정에서 문제가 발생했습니다. 다시 시도해주세요.'
        },
        'Default': {
            title: '인증 오류 발생',
            description: '로그인 과정에서 문제가 발생했습니다. 다시 시도하거나 관리자에게 문의해주세요.'
        }
    };

    const errorInfo = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;

    return (
        <div className="container flex items-center justify-center min-h-screen py-10 px-4">
            <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                        {errorInfo.title}
                    </CardTitle>
                    <CardDescription>
                        로그인 과정에서 오류가 발생했습니다
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTitle>오류 코드: {error || '알 수 없음'}</AlertTitle>
                        <AlertDescription>{errorInfo.description}</AlertDescription>
                    </Alert>

                    <div className="rounded-lg border border-muted p-4 bg-muted/50">
                        <h3 className="font-medium mb-2">해결 방법:</h3>
                        <ul className="space-y-2 list-disc pl-5 text-sm">
                            <li>
                                <a
                                    href="https://github.com/settings/emails"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    GitHub 이메일 설정
                                </a>
                                에서 이메일을 공개로 설정하세요.
                            </li>
                            <li>브라우저 쿠키를 삭제하고 다시 시도해보세요.</li>
                            <li>다른 GitHub 계정으로 로그인해보세요.</li>
                            <li>문제가 지속되면 관리자에게 문의하세요.</li>
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" asChild>
                        <Link href="/login">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            로그인으로
                        </Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            홈으로
                        </Link>
                    </Button>

                    <Button variant="default" onClick={() => window.location.reload()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        다시 시도
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
