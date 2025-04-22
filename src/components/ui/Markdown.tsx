'use client';
// src/components/ui/Markdown.tsx - 간단 버전
import React from 'react';

interface MarkdownProps {
    content: string;
}

export default function Markdown({ content }: MarkdownProps) {
    // 간단한 마크다운 파싱 (테스트용)
    // 실제로는 react-markdown 등의 라이브러리를 사용해야 함
    const parsedContent = content
        .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>')
        .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
        .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="max-width: 100%; height: auto;" />')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    return (
        <div
            className="prose prose-lg max-w-none prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
    );
}
