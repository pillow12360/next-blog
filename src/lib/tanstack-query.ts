// src/lib/tanstack-query.ts
import { QueryClient } from '@tanstack/react-query';

// 쿼리 클라이언트 생성 함수
export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // 윈도우 포커스될 때 데이터 리프레시 (기본값: true)
                refetchOnWindowFocus: false,
                // 오래된 데이터 표시 시간 (5분)
                staleTime: 1000 * 60 * 5,
                // 캐시 유지 시간 (10분)
                gcTime: 1000 * 60 * 10,
                // 실패한 요청 재시도 횟수
                retry: 1,
            },
        },
    });
}
