"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor from "@/app/admin/posts/write/TiptapEditor";
import { toast } from "sonner";
import { PostDetail } from "@/modules/blog/blog.types";

interface PostFormData {
    title: string;
    content: string;
    tags: string[];
    thumbnail?: File;
}

interface WriteOrEditPostPageProps {
    initialData?: PostDetail; // 수정 시 기존 데이터 주입
}

export default function EditPostPage({ initialData }: WriteOrEditPostPageProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const isEditMode = !!initialData;

    const { register, control, setValue, watch, getValues, formState: { errors } } = useForm<PostFormData>({
        defaultValues: {
            title: initialData?.title || "",
            content: initialData?.content || "",
            tags: initialData?.tags.map(tag => tag.name) || [],
        }
    });

    const [tagInput, setTagInput] = useState("");
    const tags = watch("tags", []);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>(initialData?.thumbnail || "");

    useEffect(() => {
        const tagsInput = document.getElementById("hidden-tags") as HTMLInputElement;
        if (tagsInput) tagsInput.value = JSON.stringify(tags);

        const contentInput = document.getElementById("hidden-content") as HTMLInputElement;
        if (contentInput) contentInput.value = watch("content");
    }, [tags, watch("content")]);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setValue("tags", [...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setValue("tags", tags.filter(tag => tag !== tagToRemove));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("thumbnail", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateFormData = () => {
        if (!formRef.current) return;
        const tagsInput = document.getElementById("hidden-tags") as HTMLInputElement;
        const contentInput = document.getElementById("hidden-content") as HTMLInputElement;
        tagsInput.value = JSON.stringify(getValues().tags);
        contentInput.value = getValues().content;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        updateFormData();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);

        startTransition(async () => {
            try {
                const endpoint = isEditMode
                    ? `/api/posts/${initialData!.id}`  // 수정
                    : "/api/posts";                    // 작성

                const method = isEditMode ? "PATCH" : "POST";

                const res = await fetch(endpoint, { method, body: formData });

                if (!res.ok) {
                    const errorData = await res.json();
                    router.push(`/error?type=${errorData.errorType}&message=${encodeURIComponent(errorData.message)}`);
                    return;
                }

                const result = await res.json();
                toast.success(isEditMode ? "게시글 수정 완료!" : "게시글 작성 완료!");

                router.push(`/blog/${result.slug}`); // 수정된 글로 이동
            } catch (error) {
                console.error("폼 제출 에러:", error);
                toast.error("저장 실패! 다시 시도해주세요.");
            }
        });
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {isEditMode ? "게시글 수정" : "새 게시글 작성"}
                    </CardTitle>
                </CardHeader>

                <form ref={formRef} onSubmit={handleSubmit}>
                    <input type="hidden" id="hidden-tags" name="tags" />
                    <input type="hidden" id="hidden-content" name="content" />

                    <CardContent className="space-y-6">

                        {/* 제목 */}
                        <div className="space-y-2">
                            <Label htmlFor="title">제목</Label>
                            <Input
                                id="title"
                                {...register("title", { required: "제목을 입력해주세요" })}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        {/* 태그 */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">태그</Label>
                            <Input
                                id="tagInput"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="태그를 입력 후 Enter"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, index) => (
                                    <Badge key={`${tag}-${index}`} className="flex gap-1">
                                        {tag}
                                        <button type="button" onClick={() => handleRemoveTag(tag)}>
                                            <X size={12} />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* 본문 */}
                        <div className="space-y-2">
                            <Label htmlFor="content">본문</Label>
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: "본문을 입력해주세요" }}
                                render={({ field }) => (
                                    <TiptapEditor
                                        value={field.value}
                                        onChange={(value: any) => {
                                            field.onChange(value);
                                            const contentInput = document.getElementById("hidden-content") as HTMLInputElement;
                                            contentInput.value = value;
                                        }}
                                    />
                                )}
                            />
                            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
                        </div>

                        {/* 썸네일 */}
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">썸네일</Label>
                            <input
                                type="file"
                                id="thumbnail"
                                name="thumbnail"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailChange}
                            />
                            {thumbnailPreview && (
                                <div className="relative">
                                    <img src={thumbnailPreview} alt="썸네일 미리보기" className="rounded-md" />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                            setValue("thumbnail", undefined);
                                            setThumbnailPreview("");
                                        }}
                                        className="absolute top-2 right-2"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>

                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            취소
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    저장 중...
                                </>
                            ) : (
                                isEditMode ? "수정 완료" : "작성 완료"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
