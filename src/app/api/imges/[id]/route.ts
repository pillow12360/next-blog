// app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

// Cloudinary 설정
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 특정 이미지 조회
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 });
        }

        const image = await prisma.image.findUnique({
            where: { id }
        });

        if (!image) {
            return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json(image);
    } catch (error) {
        console.error('이미지 조회 중 오류 발생:', error);
        return NextResponse.json(
            { error: '이미지 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 이미지 삭제
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 });
        }

        // DB에서 이미지 정보 조회
        const image = await prisma.image.findUnique({
            where: { id }
        });

        if (!image) {
            return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 });
        }

        // Cloudinary에서 이미지 삭제 (URL에서 public_id 추출)
        // 참고: 이 방법은 Cloudinary URL 형식에 따라 다를 수 있습니다
        const urlParts = image.url.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${publicIdWithExtension.split('.')[0]}`;

        // Cloudinary에서 삭제 시도
        try {
            await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });
        } catch (cloudinaryError) {
            console.error('Cloudinary에서 이미지 삭제 실패:', cloudinaryError);
            // Cloudinary 삭제 실패해도 DB에서는 삭제 진행
        }

        // DB에서 이미지 레코드 삭제
        await prisma.image.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('이미지 삭제 중 오류 발생:', error);
        return NextResponse.json(
            { error: '이미지 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
