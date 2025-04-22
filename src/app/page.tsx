// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
      <div className="p-10">
        <Link href="/blog">
          블로그로 이동
        </Link>
      </div>
  );
}
