// src/app/admin/posts/write/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Image as ImageIcon } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import TiptapEditor from "./TiptapEditor"; // 커스텀 Tiptap 에디터 컴포넌트

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
 */
export default function WritePostPage() {
    const router = useRouter();

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

    // 폼 제출 핸들러
    const onSubmit: SubmitHandler<PostFormData> = async (data) => {
        try {
            // FormData 객체 생성 (서버로 전송하기 위한 형식)
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("tags", JSON.stringify(data.tags));

            if (data.thumbnail) {
                formData.append("thumbnail", data.thumbnail);
            }

            // 여기서 API 호출하여 게시글 저장 로직 구현 (생략)
            console.log("폼 데이터:", {
                title: data.title,
                content: data.content,
                tags: data.tags,
                thumbnail: data.thumbnail ? data.thumbnail.name : null
            });

            // TODO: 실제 API 호출 코드
            // const response = await fetch('/api/posts', {
            //   method: 'POST',
            //   body: formData,
            // });

            // 성공 시 게시글 목록으로 이동
            // if (response.ok) {
            //   router.push("/admin/posts");
            // }

            alert("게시글 작성 기능은 구현되지 않았습니다. (UI 데모만 제공)");
        } catch (error) {
            console.error("게시글 저장 중 오류 발생:", error);
            alert("게시글 저장에 실패했습니다.");
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">새 게시글 작성</CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            취소
                        </Button>
                        <Button type="submit">게시글 저장</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
