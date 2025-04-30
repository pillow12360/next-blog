// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

// Cloudinary 설정
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: NextRequest) {
    try {
        // multipart/form-data로 받은 파일 처리
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: '이미지 파일이 제공되지 않았습니다.' }, { status: 400 });
        }

        // File 객체를 buffer로 변환
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 파일을 base64 형식으로 변환
        const fileStr = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${fileStr}`;

        // Cloudinary에 이미지 업로드
        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload(
                fileUri,
                {
                    folder: 'my_uploads', // Cloudinary 내 폴더명
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        // DB에 이미지 URL 저장 (스키마에 맞게 url만 저장)
        const savedImage = await prisma.image.create({
            data: {
                url: uploadResult.secure_url
            },
        });

        return NextResponse.json(savedImage);
    } catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
        return NextResponse.json(
            { error: '이미지 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
