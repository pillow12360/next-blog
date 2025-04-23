import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * 문자열을 URL에 적합한 슬러그 형태로 변환
 */
export function generateSlug(title: string): string {
  return title
      .toLowerCase()                     // 소문자로 변환
      .replace(/[^\w\s-]/g, '')         // 영문자, 숫자, 언더스코어, 하이픈, 공백 외 제거
      .replace(/\s+/g, '-')             // 공백을 하이픈으로 변환
      .replace(/--+/g, '-')             // 연속된 하이픈을 하나로 합침
      .trim();                           // 앞뒤 공백 제거
}

/**
 * 파일 확장자 추출
 */
export function getFileExtension(filename: string): string | null {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > 0 ? filename.slice(lastDotIndex + 1).toLowerCase() : null;
}

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * 이미지 업로드 유틸리티 함수 (개발용 더미 구현)
 * 실제 파일 저장 없이 개발 환경에서 테스트할 수 있는 버전입니다.
 */

/**
 * 이미지 파일을 스토리지에 업로드하고 URL을 반환합니다.
 * 개발용 더미 구현으로, 실제로 파일을 저장하지 않고 가상의 URL을 반환합니다.
 *
 * @param file - 업로드할 이미지 파일
 * @returns 업로드된 이미지의 가상 URL
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  // 개발 환경에서는 파일을 실제로 저장하지 않고 가상의 URL 반환
  return new Promise((resolve) => {
    // 파일 정보 추출 (로깅용)
    const { name, size, type } = file;
    console.log('이미지 업로드 시뮬레이션:', { name, size, type });

    // 파일 타입에 맞는 확장자 추출
    const extension = type.split('/')[1] || 'jpg';

    // 타임스탬프를 포함한 고유한 파일 경로 생성
    const timestamp = Date.now();
    const fileName = `dummy-upload-${timestamp}.${extension}`;

    // 짧은 지연 후 결과 반환 (실제 업로드 시간 시뮬레이션)
    setTimeout(() => {
      // 가상의 이미지 URL 반환
      resolve(`/api/placeholder/800/600?text=${encodeURIComponent(fileName)}`);
    }, 500);
  });
}

/**
 * 이미지 URL을 기반으로 파일을 삭제합니다. (기존 썸네일 교체 시 사용)
 * 개발용 더미 구현으로, 실제로 아무 동작도 하지 않습니다.
 *
 * @param imageUrl - 삭제할 이미지의 URL
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  // 개발 환경에서는 아무 동작도 하지 않음
  console.log('이미지 삭제 시뮬레이션:', imageUrl);
  return Promise.resolve();
}
