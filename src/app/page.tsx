import Link from 'next/link';
import { ArrowRight, BookOpen, Briefcase, Code, Github, Mail, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
    // 최근 프로젝트 데이터
    const recentProjects = [
        {
            title: '포트폴리오 블로그',
            description: 'Next.js 15와 Shadcn UI를 활용한 개인 포트폴리오 및 블로그 웹사이트',
            tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'PostgreSQL', 'Supabase'],
            link: '/'
        },
        {
            title: '세종대학교 양자원자력공학과 홈페이지',
            description: '세종대학교 교내 학과 웹사이트 프로젝트',
            tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
            link: '/portfolio/sns-app'
        },
        {
            title: '세종대학교 바이오융합공학전공 홈페이지',
            description: '사용자 친화적인 UI/UX를 갖춘 온라인 쇼핑몰 웹 애플리케이션',
            tags: ['Next.js', 'Firebase', 'Redux', 'Stripe'],
            link: '/portfolio/shop'
        }
    ];

    // 최근 블로그 포스트 데이터
    const recentPosts = [
        {
            title: 'Next.js 15에서 병렬 라우트 활용하기',
            date: '2025년 4월 15일',
            excerpt: 'Next.js 15의 새로운 기능인 병렬 라우트를 사용하여 복잡한 UI를 구현하는 방법을 알아봅니다.',
            link: '/blog/nextjs-parallel-routes'
        },
        {
            title: 'Tailwind CSS와 함께하는 효율적인 디자인 시스템',
            date: '2025년 4월 8일',
            excerpt: 'Tailwind CSS를 활용하여 일관된 디자인 시스템을 구축하고 유지하는 방법에 대해 설명합니다.',
            link: '/blog/tailwind-design-system'
        },
        {
            title: '프론트엔드 개발자를 위한 성능 최적화 팁',
            date: '2025년 4월 1일',
            excerpt: '웹 애플리케이션의 로딩 속도와 사용자 경험을 향상시키는 실용적인 성능 최적화 방법을 소개합니다.',
            link: '/blog/frontend-optimization'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            {/* 히어로 섹션 */}
            <section className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-6 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        안녕하세요, <br />저는 pillow12360입니다.
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        프론트엔드 개발자로서 사용자 중심의 웹 경험을 창조하는 데 열정을 쏟고 있습니다.
                        이 공간에서 제 작업물과 기술적 인사이트를 공유합니다.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/portfolio">
                                포트폴리오 보기 <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/contact">
                                연락하기 <Mail className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="relative w-full max-w-md aspect-square">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
                    <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                        {/* 여기에 프로필 이미지 또는 아바타를 넣을 수 있습니다 */}
                        <div className="text-7xl font-bold text-primary">P</div>
                    </div>
                </div>
            </section>

            {/* 기술 스택 섹션 */}
            <section className="py-8">
                <h2 className="text-3xl font-bold mb-6">기술 스택</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'].map((tech) => (
                        <Card key={tech} className="flex items-center justify-center p-6 text-center hover:border-primary transition-colors">
                            <p className="font-semibold">{tech}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 최근 프로젝트 섹션 */}
            <section className="py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">최근 프로젝트</h2>
                    <Button asChild variant="ghost">
                        <Link href="/portfolio">
                            모든 프로젝트 보기 <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentProjects.map((project, index) => (
                        <Card key={index} className="flex flex-col h-full hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle>{project.title}</CardTitle>
                                <CardDescription>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={project.link}>
                                        자세히 보기 <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 최근 블로그 포스트 섹션 */}
            <section className="py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">최근 블로그 포스트</h2>
                    <Button asChild variant="ghost">
                        <Link href="/blog">
                            모든 포스트 보기 <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="space-y-6">
                    {recentPosts.map((post, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 md:justify-between">
                                    <Link href={post.link} className="hover:text-primary transition-colors">
                                        <CardTitle>{post.title}</CardTitle>
                                    </Link>
                                    <span className="text-sm text-muted-foreground">{post.date}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{post.excerpt}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={post.link}>
                                        계속 읽기 <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA 섹션 */}
            <section className="py-8 text-center">
                <div className="bg-accent p-8 md:p-12 rounded-xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">함께 프로젝트를 진행해볼까요?</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        새로운 프로젝트나 협업 기회가 있다면 언제든지 연락주세요.
                        아이디어를 현실로 만드는 여정을 함께하고 싶습니다.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/contact">
                                연락하기 <Mail className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <a href="https://github.com/pillow12360" target="_blank" rel="noopener noreferrer">
                                GitHub <Github className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
            
        </div>
    );
}
