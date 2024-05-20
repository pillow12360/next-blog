import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import MainLayout from './layout/Layout';

const Home: NextPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: '첫 번째 포스트',
      summary: '이것은 첫 번째 블로그 포스트입니다.',
    },
    {
      id: 2,
      title: '두 번째 포스트',
      summary: '이것은 두 번째 블로그 포스트입니다.',
    },
    {
      id: 3,
      title: '세 번째 포스트',
      summary: '이것은 세 번째 블로그 포스트입니다.',
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Head>
          <title>dong chan</title>
        </Head>
        <section className="text-lg">Next 블로그 for pillow12360</section>
        <section>
          <h2 className="text-2xl font-bold mt-5 mb-4">Blog</h2>
          <ul>
            {blogPosts.map((post) => (
              <li key={post.id} className="mb-3 p-3 shadow rounded-lg">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
