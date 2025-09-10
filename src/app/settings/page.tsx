
'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Shield,
  Bell,
  Ban,
  HelpCircle,
  Share2,
  FileText,
  Heart,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: 'WanderLink',
      text: "Découvre WanderLink, l'application pour trouver ton prochain partenaire de voyage !",
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'Lien copié !',
          description: 'Le lien a été copié dans votre presse-papiers.',
        });
      } catch (copyErr) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de partager ou de copier le lien.',
        });
      }
    }
  };

  const settingsItems = [
    {
      icon: User,
      label: 'Paramètres du compte',
      href: '/settings/account',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: Shield,
      label: 'Paramètres de confidentialité',
      href: '/settings/privacy',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/settings/notifications',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
    {
      icon: Ban,
      label: 'Utilisateurs bloqués',
      href: '/settings/blocked-users',
      color: 'text-gray-600',
      bgColor: 'bg-gray-200',
    },
    {
      icon: HelpCircle,
      label: 'FAQ',
      href: '/settings/faq',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Share2,
      label: 'Partager avec tes amis',
      onClick: handleShare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
     {
      icon: MessageSquare,
      label: 'Réaction',
      href: 'mailto:contact@wanderlink.app',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: Shield,
      label: 'Politique de confidentialité',
      href: '/settings/privacy-policy',
      color: 'text-gray-500',
      bgColor: 'bg-gray-200',
    },
    {
      icon: FileText,
      label: "Conditions d'utilisation",
      href: '/settings/terms-of-service',
      color: 'text-gray-500',
      bgColor: 'bg-gray-200',
    },
    {
      icon: Heart,
      label: 'Aimer WanderLink',
      href: '#',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
    {
      icon: LogOut,
      label: 'Se déconnecter',
      href: '#',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b bg-background/95 px-2 py-1 backdrop-blur-sm md:px-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold">Préférences</h1>
        <div className="w-5"></div>
      </header>

      <main>
        <ul className="divide-y divide-border">
          {settingsItems.map((item) => {
            const content = (
              <div className="flex cursor-pointer items-center p-3 transition-colors hover:bg-muted/50">
                <div className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${item.bgColor}`}>
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                </div>
                <span className="flex-1 text-sm text-card-foreground">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </div>
            );
            
            if (item.href) {
              return (
                <li key={item.label}>
                  <Link href={item.href} passHref>
                    {content}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.label} onClick={item.onClick}>
                {content}
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  );
};

export default SettingsPage;
