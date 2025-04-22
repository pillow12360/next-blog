// src/app/blog/[slug]/components/PostDetailSkeleton.tsx
import React from 'react';

export default function PostDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto animate-pulse">
            {/* 헤더 스켈레톤 */}
            <header className="mb-8">
                {/* 태그 스켈레톤 */}
                <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>

                {/* 제목 스켈레톤 */}
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-3/4 bg-gray-200 rounded mb-6"></div>

                {/* 작성자 정보 스켈레톤 */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                            <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* 통계 스켈레톤 */}
                    <div className="flex items-center gap-4">
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </header>

            {/* 썸네일 이미지 스켈레톤 */}
            <div className="w-full aspect-video mb-8 bg-gray-200 rounded-lg"></div>

            {/* 본문 내용 스켈레톤 */}
            <div className="space-y-4 mb-8">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
            </div>

            {/* 인터랙션 버튼 스켈레톤 */}
            <div className="flex items-center justify-between py-6 border-t border-b mb-8">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* 댓글 섹션 스켈레톤 */}
            <div className="mt-8">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                    <div className="h-24 bg-gray-200 rounded"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
