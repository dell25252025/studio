
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

const SettingsPage = () => {
  const router = useRouter();

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
      href: '#',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Share2,
      label: 'Partager avec tes amis',
      href: '#',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
     {
      icon: MessageSquare,
      label: 'Réaction',
      href: '#',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: Shield,
      label: 'Politique de confidentialité',
      href: '#',
      color: 'text-gray-500',
      bgColor: 'bg-gray-200',
    },
    {
      icon: FileText,
      label: "Conditions d'utilisation",
      href: '#',
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
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Préférences</h1>
        <div className="w-6"></div>
      </header>

      <main>
        <ul className="divide-y divide-border">
          {settingsItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} passHref>
                <div className="flex cursor-pointer items-center p-3 transition-colors hover:bg-muted/50">
                  <div className={`mr-4 flex h-7 w-7 items-center justify-center rounded-lg ${item.bgColor}`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="flex-1 text-card-foreground text-sm">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default SettingsPage;
