// src/app/admin/posts/write/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TiptapEditor from "./TiptapEditor"; // 커스텀 Tiptap 에디터 컴포넌트
import { createPost, saveDraft } from "./actions"; // 서버 액션 임포트
import { toast } from "sonner"; // 알림을 위한 toast 컴포넌트 (설치 필요)

// 폼 데이터 타입 정의
interface PostFormData {
    title: string;
    content: string;
    tags: string[];
    thumbnail?: File;
}

/**
 * 게시글 작성 페이지 컴포넌트
 *
 * React Hook Form과 Tiptap 에디터를 활용한 블로그 게시글 작성 페이지
 * 서버 액션을 통해 게시글 저장 구현
 */
export default function WritePostPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition(); // 서버 액션 실행 상태 관리
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form 설정
    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<PostFormData>({
        defaultValues: {
            title: "",
            content: "",
            tags: [],
        }
    });

    // 태그 입력 상태 관리
    const [tagInput, setTagInput] = useState("");
    const tags = watch("tags", []);

    // 썸네일 미리보기 상태
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

    // 태그 추가 핸들러
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setValue("tags", [...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    // 태그 삭제 핸들러
    const handleRemoveTag = (tagToRemove: string) => {
        setValue("tags", tags.filter(tag => tag !== tagToRemove));
    };

    // 썸네일 업로드 핸들러
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("thumbnail", file);

            // 이미지 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 임시 저장 핸들러
    const handleSaveDraft = () => {
        const formData = new FormData();
        const { title, content } = watch();

        formData.append("title", title || "제목 없음");
        formData.append("content", content || "");

        startTransition(async () => {
            const result = await saveDraft(formData);
            if (result.success) {
                toast.success("임시 저장되었습니다.");
            } else {
                toast.error(result.error || "임시 저장에 실패했습니다.");
            }
        });
    };

    // 폼 제출 핸들러
    const onSubmit: SubmitHandler<PostFormData> = async (data) => {
        // FormData 객체 생성 (서버로 전송하기 위한 형식)
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("tags", JSON.stringify(data.tags));

        if (data.thumbnail) {
            formData.append("thumbnail", data.thumbnail);
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const result = await createPost(formData);

            if (result.success) {
                // 성공 시 클라이언트에서 리다이렉트
                toast.success('게시글이 성공적으로 저장되었습니다!');
                router.push('/blog');
            } else {
                // 실패 시 에러 메시지 표시
                setError(result.error || '알 수 없는 오류가 발생했습니다.');
                toast.error(result.error || '알 수 없는 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('폼 제출 오류:', error);
            setError('게시글 저장에 실패했습니다.');
            toast.error('게시글 저장에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        };
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">새 게시글 작성</CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        {/* 에러 메시지 표시 */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600">
                                {error}
                            </div>
                        )}

                        {/* 제목 입력 */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base font-medium">
                                제목
                            </Label>
                            <Input
                                id="title"
                                placeholder="게시글 제목을 입력하세요"
                                className="text-lg"
                                {...register("title", { required: "제목을 입력해주세요" })}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* 태그 입력 */}
                        <div className="space-y-2">
                            <Label htmlFor="tags" className="text-base font-medium">
                                태그
                            </Label>
                            <Input
                                id="tagInput"
                                placeholder="태그를 입력하고 Enter 키를 누르세요"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                            />

                            {/* 태그 표시 영역 */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag, index) => (
                                        <Badge key={`${tag}-${index}`} className="px-3 py-1 flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="cursor-pointer focus:outline-none"
                                            >
                                                <X size={14} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tiptap 에디터 */}
                        <div className="space-y-2">
                            <Label htmlFor="content" className="text-base font-medium">
                                본문
                            </Label>
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: "본문을 입력해주세요" }}
                                render={({ field }) => (
                                    <div className="min-h-[300px] border rounded-md overflow-hidden">
                                        <TiptapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </div>
                                )}
                            />
                            {errors.content && (
                                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                            )}
                        </div>

                        {/* 썸네일 업로드 */}
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail" className="text-base font-medium">
                                썸네일 이미지 (선택사항)
                            </Label>

                            <div className="border border-dashed rounded-lg p-4 text-center">
                                <input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />

                                {thumbnailPreview ? (
                                    <div className="relative">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="mx-auto max-h-48 object-contain"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setValue("thumbnail", undefined);
                                                setThumbnailPreview("");
                                            }}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="thumbnail"
                                        className="flex flex-col items-center justify-center cursor-pointer py-6"
                                    >
                                        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">
                                            클릭하여 이미지 업로드
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            JPG, PNG, GIF (최대 2MB)
                                        </p>
                                    </label>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6">
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                취소
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleSaveDraft}
                                disabled={isPending}
                            >
                                임시 저장
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="min-w-28"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    저장 중...
                                </>
                            ) : (
                                "게시글 저장"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
