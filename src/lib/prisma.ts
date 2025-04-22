import { PrismaClient } from '@prisma/client';

// 전역 변수로 Prisma 인스턴스를 선언하여 핫 리로딩 시 여러 개 생성되는 것 방지
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 개발 환경에서 로그 출력 설정
export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

// 프로덕션 환경이 아닐 때만 globalForPrisma.prisma에 할당
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
