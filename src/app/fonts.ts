import localFont from 'next/font/local';

// 나눔스퀘어라운드 폰트 설정
export const nanumSquareRound = localFont({
  src: [
    {
      path: '../../public/fonts/NanumSquareRoundL.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumSquareRoundR.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumSquareRoundB.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NanumSquareRoundEB.ttf',
      weight: '800',
      style: 'normal',
    }
  ],
  variable: '--font-nanum-square-round',
  display: 'swap',
});

// 커스텀 폰트 변수
export const fontVariables = nanumSquareRound.variable;
