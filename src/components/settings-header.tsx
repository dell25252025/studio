import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface SettingsHeaderProps {
  title: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 z-10 flex h-12 w-full items-center justify-center border-b bg-background/95 backdrop-blur-sm">
      <div className="relative flex w-full max-w-2xl items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
};
