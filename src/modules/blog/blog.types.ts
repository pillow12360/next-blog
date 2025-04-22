// src/modules/blog/blog.types.ts
import { Post, Tag, User, Comment, Like, Bookmark } from '@prisma/client';

// 포스트 검색 필터 옵션
export interface PostSearchFilter {
    keyword?: string;
    tag?: string;
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'popular' | 'comments';
}

// 포스트 생성 입력 데이터
export interface CreatePostInput {
    title: string;
    content: string;
    thumbnail?: string;
    tags: string[]; // 태그 이름 배열
}

// 포스트 업데이트 입력 데이터
export interface UpdatePostInput {
    id: string;
    title?: string;
    content?: string;
    thumbnail?: string;
    tags?: string[]; // 태그 이름 배열
}

// 댓글 생성 입력 데이터
export interface CreateCommentInput {
    content: string;
    postId: string;
    parentId?: string;
}

// 포스트 상호작용(좋아요/북마크) 입력 데이터
export interface PostInteractionInput {
    postId: string;
}

// 클라이언트에서 사용하는 포스트 리스트 아이템 타입
export type PostListItem = Pick<Post, 'id' | 'title' | 'slug' | 'thumbnail' | 'createdAt' | 'viewCount'> & {
    author: Pick<User, 'id' | 'name' | 'image'>;
    tags: Pick<Tag, 'id' | 'name'>[];
    _count: {
        comments: number;
        likes: number;
    };
};

// 클라이언트에서 사용하는 포스트 상세 타입
export type PostDetail = Post & {
    author: Pick<User, 'id' | 'name' | 'image'>;
    tags: Tag[];
    comments: (Comment & {
        user: Pick<User, 'id' | 'name' | 'image'>;
        replies: (Comment & {
            user: Pick<User, 'id' | 'name' | 'image'>;
        })[];
    })[];
    _count: {
        likes: number;
        bookmarks: number;
        comments: number;
    };
};

// API 응답 타입
export interface PostsResponse {
    posts: PostListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 사용자 상호작용 정보 타입
export interface UserInteractions {
    liked: boolean;
    bookmarked: boolean;
}
