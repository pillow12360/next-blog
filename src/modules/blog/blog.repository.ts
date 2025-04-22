// src/modules/blog/blog.repository.ts
import { prisma } from '@/lib/prisma';
import {
    CreatePostInput,
    UpdatePostInput,
    CreateCommentInput,
    PostInteractionInput,
    PostSearchFilter
} from './blog.types';
import { generateSlug } from '@/lib/utils';

/**
 * 포스트 목록 조회
 */
export async function findPosts(filter: PostSearchFilter = {}) {
    const {
        keyword = '',
        tag = '',
        page = 1,
        limit = 10,
        sortBy = 'latest'
    } = filter;

    const skip = (page - 1) * limit;

    // 정렬 조건 설정
    let orderBy: any = {};
    switch (sortBy) {
        case 'popular':
            orderBy = { viewCount: 'desc' };
            break;
        case 'comments':
            orderBy = { comments: { _count: 'desc' } };
            break;
        case 'latest':
        default:
            orderBy = { createdAt: 'desc' };
            break;
    }

    // 검색 조건 설정
    const where: any = {};

    if (keyword) {
        where.OR = [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } }
        ];
    }

    if (tag) {
        where.tags = {
            some: {
                name: tag
            }
        };
    }

    const posts = await prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            createdAt: true,
            viewCount: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            tags: {
                select: {
                    id: true,
                    name: true
                }
            },
            _count: {
                select: {
                    comments: true,
                    likes: true
                }
            }
        }
    });

    const total = await prisma.post.count({ where });

    return {
        posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

/**
 * Slug로 포스트 조회
 */
export async function findPostBySlug(slug: string, incrementView = false) {
    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            tags: true,
            comments: {
                where: { parentId: null },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            },
            _count: {
                select: {
                    likes: true,
                    bookmarks: true,
                    comments: true
                }
            }
        }
    });

    if (!post) return null;

    // 조회수 증가 (옵션이 활성화된 경우만)
    if (incrementView) {
        await prisma.post.update({
            where: { id: post.id },
            data: { viewCount: { increment: 1 } }
        });
    }

    return post;
}

/**
 * 포스트 생성
 */
export async function createPostInDb(userId: string, data: CreatePostInput) {
    const { title, content, thumbnail, tags } = data;

    // slug 생성
    const slug = generateSlug(title);

    // 기존에 동일한 slug가 있는지 확인
    const existingPost = await prisma.post.findUnique({
        where: { slug }
    });

    // 동일한 slug가 있으면 timestamp를 덧붙임
    const finalSlug = existingPost
        ? `${slug}-${Date.now()}`
        : slug;

    const post = await prisma.post.create({
        data: {
            title,
            slug: finalSlug,
            content,
            thumbnail,
            author: {
                connect: { id: userId }
            },
            tags: {
                connectOrCreate: tags.map(tagName => ({
                    where: { name: tagName },
                    create: { name: tagName }
                }))
            }
        },
        include: {
            tags: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return post;
}

/**
 * 포스트 업데이트
 */
export async function updatePostInDb(userId: string, data: UpdatePostInput) {
    const { id, title, content, thumbnail, tags } = data;

    // 포스트가 존재하고 현재 사용자가 작성자인지 확인
    const post = await prisma.post.findUnique({
        where: { id },
        select: { authorId: true, slug: true }
    });

    if (!post) {
        throw new Error('포스트를 찾을 수 없습니다.');
    }

    if (post.authorId !== userId) {
        throw new Error('포스트 수정 권한이 없습니다.');
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};

    if (title) {
        updateData.title = title;

        // 제목이 변경된 경우 slug도 업데이트
        const newSlug = generateSlug(title);

        // 기존 슬러그와 다를 경우에만 중복 체크 및 업데이트
        if (newSlug !== post.slug) {
            const existingPost = await prisma.post.findFirst({
                where: {
                    slug: newSlug,
                    id: { not: id }
                }
            });

            updateData.slug = existingPost
                ? `${newSlug}-${Date.now()}`
                : newSlug;
        }
    }

    if (content !== undefined) {
        updateData.content = content;
    }

    if (thumbnail !== undefined) {
        updateData.thumbnail = thumbnail;
    }

    // 트랜잭션으로 태그 업데이트 및 포스트 업데이트
    const updatedPost = await prisma.$transaction(async (tx) => {
        // 태그 업데이트가 필요한 경우
        if (tags) {
            // 기존 태그 연결 해제
            await tx.post.update({
                where: { id },
                data: {
                    tags: {
                        set: []
                    }
                }
            });

            // 새 태그 연결
            return tx.post.update({
                where: { id },
                data: {
                    ...updateData,
                    tags: {
                        connectOrCreate: tags.map(tagName => ({
                            where: { name: tagName },
                            create: { name: tagName }
                        }))
                    }
                },
                include: {
                    tags: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            });
        }

        // 태그 업데이트가 없는 경우
        return tx.post.update({
            where: { id },
            data: updateData,
            include: {
                tags: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
    });

    return updatedPost;
}

/**
 * 포스트 삭제
 */
export async function deletePostFromDb(userId: string, postId: string) {
    // 포스트가 존재하고 현재 사용자가 작성자인지 확인
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true }
    });

    if (!post) {
        throw new Error('포스트를 찾을 수 없습니다.');
    }

    if (post.authorId !== userId) {
        throw new Error('포스트 삭제 권한이 없습니다.');
    }

    // 트랜잭션으로 관련 데이터 모두 삭제
    await prisma.$transaction([
        // 좋아요 삭제
        prisma.like.deleteMany({
            where: { postId }
        }),
        // 북마크 삭제
        prisma.bookmark.deleteMany({
            where: { postId }
        }),
        // 댓글 삭제 (계층 구조라 두 단계로 삭제)
        prisma.comment.deleteMany({
            where: {
                postId,
                parentId: { not: null }
            }
        }),
        prisma.comment.deleteMany({
            where: { postId }
        }),
        // 마지막으로 포스트 삭제
        prisma.post.delete({
            where: { id: postId }
        })
    ]);

    return { success: true, id: postId };
}

/**
 * 댓글 생성
 */
export async function createCommentInDb(userId: string, data: CreateCommentInput) {
    const { content, postId, parentId } = data;

    const comment = await prisma.comment.create({
        data: {
            content,
            user: {
                connect: { id: userId }
            },
            post: {
                connect: { id: postId }
            },
            ...(parentId && {
                parent: {
                    connect: { id: parentId }
                }
            })
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    return comment;
}

/**
 * 댓글 삭제
 */
export async function deleteCommentFromDb(userId: string, commentId: string) {
    // 댓글이 존재하고 현재 사용자가 작성자인지 확인
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: {
            userId: true,
            parentId: true
        }
    });

    if (!comment) {
        throw new Error('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
        throw new Error('댓글 삭제 권한이 없습니다.');
    }

    // 삭제 전략 - 부모 댓글이면 자식 댓글도 모두 삭제
    if (!comment.parentId) {
        await prisma.comment.deleteMany({
            where: { parentId: commentId }
        });
    }

    await prisma.comment.delete({
        where: { id: commentId }
    });

    return { success: true, id: commentId };
}

/**
 * 좋아요 토글
 */
export async function toggleLikeInDb(userId: string, { postId }: PostInteractionInput) {
    // 기존 좋아요 확인
    const existingLike = await prisma.like.findFirst({
        where: {
            userId,
            postId
        }
    });

    if (existingLike) {
        // 좋아요 취소
        await prisma.like.delete({
            where: { id: existingLike.id }
        });
        return { liked: false, postId };
    } else {
        // 좋아요 추가
        await prisma.like.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                post: {
                    connect: { id: postId }
                }
            }
        });
        return { liked: true, postId };
    }
}

/**
 * 북마크 토글
 */
export async function toggleBookmarkInDb(userId: string, { postId }: PostInteractionInput) {
    // 기존 북마크 확인
    const existingBookmark = await prisma.bookmark.findFirst({
        where: {
            userId,
            postId
        }
    });

    if (existingBookmark) {
        // 북마크 취소
        await prisma.bookmark.delete({
            where: { id: existingBookmark.id }
        });
        return { bookmarked: false, postId };
    } else {
        // 북마크 추가
        await prisma.bookmark.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                post: {
                    connect: { id: postId }
                }
            }
        });
        return { bookmarked: true, postId };
    }
}

/**
 * 사용자 상호작용 정보 조회
 */
export async function findUserInteractions(userId: string, postId: string) {
    const [like, bookmark] = await Promise.all([
        prisma.like.findFirst({
            where: { userId, postId }
        }),
        prisma.bookmark.findFirst({
            where: { userId, postId }
        })
    ]);

    return {
        liked: !!like,
        bookmarked: !!bookmark,
        postId
    };
}

/**
 * 인기 태그 목록 조회
 */
export async function findTags() {
    const tags = await prisma.tag.findMany({
        include: {
            _count: {
                select: {
                    posts: true
                }
            }
        },
        orderBy: {
            posts: {
                _count: 'desc'
            }
        },
        take: 20
    });

    return tags;
}

/**
 * 관련 포스트 조회
 */
export async function findRelatedPosts(postId: string, limit = 4) {
    // 현재 포스트의 태그들 가져오기
    const currentPost = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            tags: {
                select: {
                    id: true
                }
            }
        }
    });

    if (!currentPost) return [];

    const tagIds = currentPost.tags.map(tag => tag.id);

    // 같은 태그를 가진 다른 포스트 찾기
    const relatedPosts = await prisma.post.findMany({
        where: {
            id: { not: postId },
            tags: {
                some: {
                    id: { in: tagIds }
                }
            }
        },
        select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            createdAt: true,
            viewCount: true,
            author: {
                select: {
                    id: true, // id 필드 추가
                    name: true,
                    image: true
                }
            },
            tags: {  // tags 필드 추가
                select: {
                    id: true,
                    name: true
                }
            },
            _count: {
                select: {
                    comments: true,
                    likes: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: limit
    });


    return relatedPosts;
}
