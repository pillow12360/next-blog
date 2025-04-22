
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
