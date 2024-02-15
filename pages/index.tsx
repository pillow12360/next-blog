// 예: app/page/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import homeStyles from '../styles/Home.module.css';
import MainLayout from '../app/layout/MainLayout';

const Home: NextPage = () => {
  // 블로그 포스트를 나타낼 가상의 데이터 배열
  const blogPosts = [
    { id: 1, title: '첫 번째 포스트', summary: '이것은 첫 번째 블로그 포스트입니다.' },
    { id: 2, title: '두 번째 포스트', summary: '이것은 두 번째 블로그 포스트입니다.' },
    {id: 3, title: "세 번째 포스트", summary:'이것은 세 번째 블로그 포스트입니다.'},
    // 더 많은 포스트...
  ];

  return (
    <MainLayout>
    <div className={homeStyles.container}>
      <Head>
        <title>dong chan</title>
      </Head>
      <section className={homeStyles.headingMd}>
        <p>안뇽</p>
        <p>This is a blog</p>
      </section>
      <section className={homeStyles.postsSection}>
        <h2 className={homeStyles.headingLg}>Blog</h2>
        <ul className={homeStyles.list}>
          {blogPosts.map(post => (
            <li key={post.id} className={homeStyles.listItem}>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
    </MainLayout>
  );
};

export default Home;
