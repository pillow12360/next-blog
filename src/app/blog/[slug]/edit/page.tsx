// app/blog/[slug]/edit/page.tsx
import WriteOrEditPostPage from "../components/EditPostPage";
import { findPostBySlug } from "@/modules/blog/blog.repository";

export default async function EditPage({ params }: { params: { slug: string } }) {
    const post = await findPostBySlug(params.slug);

    if (!post) {
        // 에러 처리
        throw new Error('포스트를 찾을 수 없습니다.');
    }

    return (
        <WriteOrEditPostPage initialData={post} />
    );
}
