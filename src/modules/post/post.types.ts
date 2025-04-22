import { Post, Tag } from '@prisma/client';

// Post 생성을 위한 DTO(Data Transfer Object)
export interface CreatePostDto {
    title: string;
    content: string;
    slug: string;
    thumbnail?: string;
    tags: string[]; // 태그 ID 배열
}

// Post 업데이트를 위한 DTO
export interface UpdatePostDto {
    id: string;
    title?: string;
    content?: string;
    slug?: string;
    thumbnail?: string;
    tags?: string[]; // 태그 ID 배열
}

// Post 조회 시 반환 타입 (태그 포함)
export interface PostWithTags extends Post {
    tags: Tag[];
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
    _count?: {
        comments: number;
        likes: number;
    };
}

// 포스트 목록 조회 옵션
export interface PostListOptions {
    page?: number;
    limit?: number;
    orderBy?: 'latest' | 'views';
    tagId?: string;
    search?: string;
}
