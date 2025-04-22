// 예시: src/app/example/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';

// 데이터를 가져오는 함수
const fetchData = async () => {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다');
    }
    return response.json();
};

export default function ExamplePage() {
    // useQuery 훅을 사용하여 데이터 가져오기
    const { data, isLoading, error } = useQuery({
        queryKey: ['example-data'],
        queryFn: fetchData,
    });

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>에러가 발생했습니다: {error.message}</div>;

    return (
        <div>
            <h1>데이터 예시</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
