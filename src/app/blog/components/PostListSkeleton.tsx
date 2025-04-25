import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 포스트 목록 로딩 스켈레톤 컴포넌트
 *
 * 포스트 데이터가 로딩 중일 때 표시되는 스켈레톤 UI입니다.
 * Next.js의 Suspense와 함께 사용하여 로딩 상태를 표시합니다.
 */
export default function PostListSkeleton() {
    // 표시할 스켈레톤 카드 개수
    const skeletonCount = 6;

    return (
        <div className="space-y-8">
            {/* 포스트 그리드 스켈레톤 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div
                        key={index}
                        className="flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm"
                    >
                        {/* 썸네일 스켈레톤 */}
                        <Skeleton className="aspect-video w-full" />

                        {/* 컨텐츠 스켈레톤 */}
                        <div className="p-5 space-y-3">
                            {/* 태그 스켈레톤 */}
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>

                            {/* 제목 스켈레톤 */}
                            <Skeleton className="h-7 w-full" />
                            <Skeleton className="h-7 w-3/4" />

                            {/* 메타 정보 스켈레톤 */}
                            <div className="pt-4 flex items-center space-x-4">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-12" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 스켈레톤 */}
            <div className="flex justify-center my-8">
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </div>
        </div>
    );
}
