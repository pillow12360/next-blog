import { GeistMono } from 'geist/font';
import { fontVariables } from './fonts';
import './globals.css';
import { AppProviders } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${fontVariables} ${GeistMono.variable}`}>
      <body className="font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
