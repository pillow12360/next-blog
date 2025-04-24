// src/components/layout/Footer.tsx
import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

/**
 * 푸터 컴포넌트 - 서버 컴포넌트
 *
 * 주요 섹션:
 * - 소개 및 카피라이트
 * - 사이트맵
 * - 소셜 미디어 링크
 * - 이메일 구독 폼 (옵션)
 */
export function Footer() {
    return (
        <footer className="border-t bg-muted/40 w-full">
            <div className="container w-full mx-auto px-4 py-8 md:py-12">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="font-bold text-lg">Portfolio</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Next.js, React, TypeScript를 활용한 웹 개발 포트폴리오 사이트입니다.
                            모든 프로젝트와 블로그 글을 이곳에서 확인하실 수 있습니다.
                        </p>
                    </div>

                    {/* 퀵 링크 */}
                    <div className="space-y-3">
                        <div className="font-semibold">사이트맵</div>
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                홈
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                소개
                            </Link>
                            <Link
                                href="/portfolio"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                포트폴리오
                            </Link>
                            <Link
                                href="/blog"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                블로그
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                연락처
                            </Link>
                        </nav>
                    </div>

                    {/* 연락처 */}
                    <div className="space-y-3">
                        <div className="font-semibold">연락처</div>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>서울특별시 중랑구</p>
                            <p>pillow12360@gmail.com</p>
                            <p>010-6663-1256</p>
                        </div>
                    </div>

                    {/* 소셜 미디어 */}
                    <div className="space-y-3">
                        <div className="font-semibold">소셜 미디어</div>
                        <div className="flex items-center space-x-2">
                            <Link
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link
                                href="mailto:pillow12360@gmail.com"
                                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 카피라이트 */}
                <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} 포트폴리오. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
