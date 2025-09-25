import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import BackButtonHandler from '@/components/back-button-handler';
import { Playfair_Display, Poppins, PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'WanderLink',
  description: 'Connect. Explore. Discover.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

const fontBody = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const fontHeadline = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

const fontLogo = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-logo',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body className={cn(
        "font-body antialiased",
        fontBody.variable,
        fontHeadline.variable,
        fontLogo.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <BackButtonHandler />
        </ThemeProvider>
      </body>
    </html>
  );
}
