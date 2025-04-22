import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <section className="mb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">블로그</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Next.js, TypeScript, Prisma, TailwindCSS를 활용한 블로그입니다.
            다양한 주제의 기술 아티클을 확인해보세요.
          </p>
        </div>


        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">최신 포스트</h2>
            <Link href="/blog" className="text-blue-500 hover:underline">
              모든 포스트 보기
            </Link>
          </div>

        </div>
      </section>
      
      <section className="font-test mt-12 p-6 border rounded-lg bg-slate-50">
        <h2 className="text-2xl font-bold mb-4">폰트 테스트</h2>
        <p className="font-light mb-2">Light 텍스트</p>
        <p className="font-normal mb-2">Regular 텍스트</p>
        <p className="font-bold mb-2">Bold 텍스트</p>
        <p className="font-extrabold mb-2">Extra Bold 텍스트</p>
      </section>
    </main>
  );
}
