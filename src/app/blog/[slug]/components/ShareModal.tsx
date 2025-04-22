'use client';
// src/app/blog/[slug]/components/ShareModal.tsx (간소화)
import React, { useRef } from 'react';
import { Copy, X, Share, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    postTitle: string;
    postSlug: string;
}

export default function ShareModal({ isOpen, onClose, postTitle, postSlug }: ShareModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // 테스트용 URL
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/blog/${postSlug}`
        : `/blog/${postSlug}`;

    // URL 복사 핸들러
    const handleCopyUrl = () => {
        if (inputRef.current) {
            inputRef.current.select();
            navigator.clipboard.writeText(inputRef.current.value);
            alert('URL이 클립보드에 복사되었습니다.');
        }
    };

    // 소셜 미디어 공유 핸들러 (테스트용 alert 표시)
    const handleShareFacebook = () => {
        alert(`페이스북에 공유: ${shareUrl}`);
    };

    const handleShareTwitter = () => {
        alert(`트위터에 공유: ${shareUrl}`);
    };

    const handleShareLinkedIn = () => {
        alert(`링크드인에 공유: ${shareUrl}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <Share className="mr-2" size={20} />
                        공유하기
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 공유 URL */}
                <div className="flex items-center space-x-2 mb-6">
                    <input
                        ref={inputRef}
                        readOnly
                        value={shareUrl}
                        className="flex-1 border p-2 rounded"
                    />
                    <button
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded"
                        onClick={handleCopyUrl}
                    >
                        <Copy size={18} />
                    </button>
                </div>

                {/* 소셜 미디어 공유 버튼 */}
                <div>
                    <p className="text-sm text-gray-500 mb-3">소셜 미디어에 공유하기</p>
                    <div className="flex space-x-4">
                        <button
                            className="p-2 rounded-full border hover:bg-blue-50 hover:text-blue-600"
                            onClick={handleShareFacebook}
                        >
                            <Facebook />
                        </button>

                        <button
                            className="p-2 rounded-full border hover:bg-blue-50 hover:text-blue-500"
                            onClick={handleShareTwitter}
                        >
                            <Twitter />
                        </button>

                        <button
                            className="p-2 rounded-full border hover:bg-blue-50 hover:text-blue-700"
                            onClick={handleShareLinkedIn}
                        >
                            <Linkedin />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
