
'use client';

import { useState } from 'react';
import { Check, Languages } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsHeader } from '@/components/settings/settings-header';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // 'fr' is default
  const { toast } = useToast();

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    const langName = languages.find(l => l.code === langCode)?.name;
    toast({
      title: 'Langue modifiée',
      description: `La langue de l'application est maintenant : ${langName}`,
    });
    // In a real app, you would also save this to user preferences and update the i18n provider.
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <SettingsHeader title="Langue" />
      <main className="px-2 py-4 md:px-4 pt-16">
        <div className="mx-auto max-w-2xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Languages /> Choisir une langue</CardTitle>
              <CardDescription>Sélectionnez la langue d'affichage de l'application.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start p-4 h-auto text-base",
                        selectedLanguage === lang.code && "border-primary ring-2 ring-primary"
                      )}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span className="mr-4 text-2xl">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.name}</span>
                      {selectedLanguage === lang.code && <Check className="h-5 w-5 text-primary" />}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
