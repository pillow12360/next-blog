// src/app/blog/components/PostListSkeleton.tsx
import React from 'react';

export default function PostListSkeleton() {
    // 로딩 시 9개의 스켈레톤 카드 표시
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {Array.from({ length: 9 }).map((_, index) => (
                <div
                    key={index}
                    className="border rounded-lg overflow-hidden shadow-sm animate-pulse"
                >
                    {/* 썸네일 스켈레톤 */}
                    <div className="bg-gray-200 aspect-video"></div>

                    {/* 내용 스켈레톤 */}
                    <div className="p-4">
                        {/* 태그 스켈레톤 */}
                        <div className="flex gap-2 mb-2">
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        </div>

                        {/* 제목 스켈레톤 */}
                        <div className="h-7 bg-gray-200 rounded mb-2"></div>
                        <div className="h-7 w-3/4 bg-gray-200 rounded mb-4"></div>

                        {/* 작성자 정보 스켈레톤 */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>

                        {/* 통계 정보 스켈레톤 */}
                        <div className="flex items-center gap-4">
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
