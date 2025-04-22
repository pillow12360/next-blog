// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('시드 데이터 생성 시작...');

    // 1. 태그 데이터 생성 (이미 존재하는 경우 업데이트)
    const tagNames = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Prisma', 'TailwindCSS'];
    const tags = await Promise.all(
        tagNames.map(name =>
            prisma.tag.upsert({
              where: { name },
              update: {},
              create: { name },
            })
        )
    );

    console.log(`생성된 태그: ${tags.map(tag => tag.name).join(', ')}`);

    // 2. 관리자 생성
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: '관리자',
        role: 'ADMIN',
      },
    });

    // 3. 일반 사용자 생성
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: '일반사용자',
        role: 'USER',
      },
    });

    console.log(`생성된 사용자: ${admin.name}, ${user.name}`);

    // 포스트 데이터 정의
    const posts = [
      {
        title: 'Next.js 앱 라우터 완벽 가이드',
        slug: 'nextjs-app-router-complete-guide',
        content: `
# Next.js 앱 라우터 완벽 가이드

Next.js 13에서 도입된 앱 라우터(App Router)는 서버 컴포넌트, 중첩 라우팅, 레이아웃 등의 기능을 제공합니다. 이 글에서는 앱 라우터의 주요 기능과 사용법에 대해 알아보겠습니다.

## 앱 라우터의 주요 기능

1. **서버 컴포넌트**: 기본적으로 모든 컴포넌트는 서버 컴포넌트입니다.
2. **중첩 라우팅**: 폴더 구조로 쉽게 중첩 라우팅을 구현할 수 있습니다.
3. **레이아웃**: 여러 페이지에서 공통으로 사용되는 UI를 레이아웃으로 분리할 수 있습니다.
4. **로딩 및 에러 UI**: 자동으로 로딩 및 에러 상태를 처리할 수 있습니다.

## 앱 라우터 사용법

\`\`\`tsx
// app/page.tsx
export default function Home() {
  return <h1>홈페이지</h1>;
}

// app/blog/page.tsx
export default function Blog() {
  return <h1>블로그</h1>;
}

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

앱 라우터를 사용하면 더 직관적이고 강력한 라우팅 시스템을 구축할 수 있습니다.
        `,
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1200&auto=format&fit=crop',
        authorId: admin.id,
        viewCount: 120,
        tags: {
          connect: [
            { name: 'Next.js' },
            { name: 'React' },
            { name: 'JavaScript' }
          ]
        }
      },
      // 다른 포스트 데이터 생략 (너무 길어서)...
      {
        title: 'TypeScript 제네릭 완벽 이해하기',
        slug: 'understanding-typescript-generics',
        content: `
# TypeScript 제네릭 완벽 이해하기

제네릭은 TypeScript의 강력한 기능 중 하나로, 타입을 변수처럼 사용할 수 있게 해줍니다. 이 글에서는 제네릭의 기본 개념부터 고급 사용법까지 알아보겠습니다.

## 제네릭의 기본 개념

제네릭을 사용하면 함수, 클래스, 인터페이스 등에서 타입을 매개변수로 받을 수 있습니다:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

// 호출 방법 1: 타입 인수 명시
const result1 = identity<string>('hello');

// 호출 방법 2: 타입 추론 사용
const result2 = identity(42); // number 타입으로 추론됨
\`\`\`

// 나머지 내용 생략...
        `,
        thumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop',
        authorId: admin.id,
        viewCount: 102,
        tags: {
          connect: [
            { name: 'TypeScript' },
            { name: 'JavaScript' }
          ]
        }
      },
      // 다른 포스트들...
    ];

    // 포스트 생성 함수 - 타입 추가
    const createPostWithComments = async (postData: any) => {
      const post = await prisma.post.create({
        data: postData
      });

      // 댓글 생성
      await prisma.comment.createMany({
        data: [
          {
            content: `${post.title}에 대한 첫 번째 댓글입니다. 좋은 글 감사합니다!`,
            userId: user.id,
            postId: post.id
          },
          {
            content: `정말 유익한 내용이네요. 더 자세한 예제도 있으면 좋겠습니다.`,
            userId: admin.id,
            postId: post.id
          }
        ]
      });

      // 첫 번째 댓글 찾기
      const firstComment = await prisma.comment.findFirst({
        where: { postId: post.id }
      });

      if (firstComment) {
        // 대댓글 생성
        await prisma.comment.create({
          data: {
            content: '저도 이 글이 도움이 많이 됐어요!',
            userId: admin.id,
            postId: post.id,
            parentId: firstComment.id
          }
        });
      }

      // 좋아요 생성
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id
        }
      });

      // 북마크 생성
      await prisma.bookmark.create({
        data: {
          userId: admin.id,
          postId: post.id
        }
      });

      return post;
    };

    // 각 포스트 생성
    for (const postData of posts) {
      await createPostWithComments(postData);
    }

    // 프로젝트 생성
    await prisma.project.create({
      data: {
        title: '개인 블로그 프로젝트',
        description: 'Next.js, Prisma, TailwindCSS를 사용한 개인 블로그 프로젝트입니다.',
        image: 'https://images.unsplash.com/photo-1607706009771-de8808640bcf?q=80&w=1200&auto=format&fit=crop',
        githubUrl: 'https://github.com/username/blog-project',
        liveUrl: 'https://blog-project.vercel.app',
        techStack: ['Next.js', 'TypeScript', 'Prisma', 'TailwindCSS', 'PostgreSQL'],
        authorId: admin.id
      }
    });

    console.log('시드 데이터 생성 완료!');
  } catch (error) {
    console.error('시드 데이터 생성 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
    .catch((e) => {
      console.error('시드 데이터 생성 중 오류 발생:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
