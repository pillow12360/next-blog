'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteButton({ slug }: { slug: string }) {
    const router = useRouter();

    const handleRemove = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            console.log("삭제 요청 slug:", slug);
            const res = await fetch(`/api/posts/${slug}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("삭제 응답:", res.status);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "삭제 실패");
            }

            toast.success("게시글이 삭제되었습니다.");
            router.push("/blog"); // 블로그 메인으로 이동
            router.refresh(); // Next.js 캐시 갱신
        } catch (error) {
            console.error("삭제 에러:", error);
            toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <Button onClick={handleRemove} variant="destructive">게시글 삭제하기</Button>
    );
}
