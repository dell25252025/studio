
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import BackButtonHandler from '@/components/back-button-handler';
import { Playfair_Display, Poppins, PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
// import IncomingCallManager from '@/components/incoming-call-manager';
import Script from 'next/script';
import { Suspense } from 'react';

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
          <Suspense>
            {children}
          </Suspense>
          <Toaster />
          <BackButtonHandler />
          {/* IncomingCallManager est déplacé dans les pages où l'utilisateur est connecté */}
        </ThemeProvider>
         <Script id="capacitor-force-redirect" strategy="afterInteractive">
          {`
            (function() {
              // Exécute ce script uniquement dans un contexte Capacitor (natif)
              if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                // L'URL du serveur de développement que nous voulons forcer
                var targetHost = '192.168.100.26:3000';
                var currentHost = window.location.host;

                // Si l'hôte actuel n'est pas celui que nous voulons, on redirige.
                if (currentHost !== targetHost) {
                  console.log('Capacitor: Hôte incorrect détecté (' + currentHost + '). Redirection vers ' + targetHost);
                  window.location.href = 'http://' + targetHost;
                }
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
