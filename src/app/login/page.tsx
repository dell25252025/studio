
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/useIsMobile';
import AuthForm from '@/components/auth-form';

const desktopVideoUrl = "https://ik.imagekit.io/fip3ktm2p/545556555_24610768548534823_5832326088093088554_n.mp4?updatedAt=1757753813634";
const mobileVideoUrl = "https://ik.imagekit.io/fip3ktm2p/video%20app2.mp4?updatedAt=1757957531301";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const resetAuthState = () => {
    setIsEmailFormVisible(false);
  };

  if (isMobile && isEmailFormVisible) {
    return (
      <div className="flex h-screen flex-col bg-background p-4">
        <div className="flex-shrink-0">
          <button onClick={resetAuthState} aria-label="Retour">
            <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 flex-col justify-center text-center">
            <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
                {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <div className="w-full">
                <AuthForm
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    isEmailFormVisible={isEmailFormVisible}
                    setIsEmailFormVisible={setIsEmailFormVisible}
                    onSuccess={() => router.push(isLogin ? '/' : '/create-profile')}
                />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
        <video
          key={isMobile ? 'mobile' : 'desktop'}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source
            src={isMobile ? mobileVideoUrl : desktopVideoUrl}
            type="video/mp4"
          />
        </video>
        <div className="absolute top-0 left-0 h-full w-full bg-black/30" />
      </div>

      <div className="relative z-10">
        <div className="grid min-h-screen items-center md:grid-cols-2">
            <div className="hidden md:flex flex-col justify-center p-12 lg:p-16">
              <h1 className="text-6xl font-bold font-logo text-white mb-4">
                  WanderLink
              </h1>
              <p className="text-xl text-white">
                  Trouvez des compagnons de voyage qui partagent votre passion. Votre prochaine grande aventure commence ici.
              </p>
            </div>

            <div className="flex flex-col h-screen p-4 md:items-center md:justify-center md:h-auto">
                <div className={`text-center md:hidden pt-2 flex-shrink-0 ${isEmailFormVisible ? 'hidden' : ''}`}>
                    <button onClick={resetAuthState} className="flex w-full justify-center items-center gap-2 bg-transparent border-none p-0" aria-label="Retour à l\'accueil de l\'authentification">
                        <h1 className="text-2xl font-bold font-logo text-white">
                            WanderLink
                        </h1>
                    </button>
                    <p className={`text-sm text-white px-1 leading-tight text-center md:hidden mt-1 w-full mx-auto ${isEmailFormVisible ? 'hidden' : ''}`}>
                        Trouvez des compagnons de voyage qui partagent votre passion
                    </p>
                </div>
            
                <div className='flex-1 flex flex-col w-full max-w-sm mx-auto justify-end pb-4 md:justify-center'>
                  <AuthForm
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                      isEmailFormVisible={isEmailFormVisible}
                      setIsEmailFormVisible={setIsEmailFormVisible}
                      onSuccess={() => router.push(isLogin ? '/' : '/create-profile')}
                  />
                </div>

                <div className={`absolute bottom-0 left-0 right-0 text-center md:hidden pb-2 flex-shrink-0 ${isEmailFormVisible ? 'hidden' : ''}`}>
                    <p className="text-[9px] text-white px-4">
                        En vous inscrivant, vous acceptez notre <Link href="/settings/privacy-policy" className="underline">Politique de confidentialité</Link>.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
