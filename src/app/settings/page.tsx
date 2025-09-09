
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
} from 'lucide-react';
import Link from 'next/link';

const SettingsPage = () => {
  const router = useRouter();

  const settingsItems = [
    {
      section: 'Compte',
      items: [
        {
          icon: User,
          label: 'Paramètres du compte',
          href: '#',
          color: 'text-green-500',
          bgColor: 'bg-green-100',
        },
        {
          icon: Shield,
          label: 'Paramètres de confidentialité',
          href: '#',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
        },
        {
          icon: Bell,
          label: 'Notifications',
          href: '#',
          color: 'text-pink-500',
          bgColor: 'bg-pink-100',
        },
        {
          icon: Ban,
          label: 'Utilisateurs bloqués',
          href: '#',
          color: 'text-gray-600',
          bgColor: 'bg-gray-200',
        },
      ],
    },
    {
      section: 'Support',
      items: [
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
      ],
    },
    {
      section: 'À Propos',
      items: [
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
      ],
    },
     {
      section: 'Action',
      items: [
        {
          icon: LogOut,
          label: 'Se déconnecter',
          href: '#',
          color: 'text-red-500',
          bgColor: 'bg-red-100',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur-sm">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Préférences</h1>
        <div className="w-8"></div>
      </header>

      <main className="p-4">
        <div className="space-y-8">
          {settingsItems.map((section) => (
            <div key={section.section}>
              <h2 className="px-4 text-sm font-semibold text-muted-foreground">
                {section.section.toUpperCase()}
              </h2>
              <div className="mt-2 overflow-hidden rounded-lg border bg-card">
                {section.items.map((item, index) => (
                  <Link href={item.href} key={item.label} passHref>
                    <div className={`flex cursor-pointer items-center p-4 transition-colors hover:bg-muted/50 ${index > 0 ? 'border-t' : ''}`}>
                      <div className={`mr-4 flex h-8 w-8 items-center justify-center rounded-lg ${item.bgColor}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="flex-1 text-card-foreground">{item.label}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
