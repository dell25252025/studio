
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Mail, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for notification settings
  const [pushNotifications, setPushNotifications] = useState({
    newMessages: true,
    profileVisits: true,
    newMatches: true,
  });
  const [emailNotifications, setEmailNotifications] = useState({
    newsAndUpdates: true,
    weeklyDigest: false,
  });

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log({
      pushNotifications,
      emailNotifications,
    });
    
    setIsSubmitting(false);
    toast({
      title: 'Paramètres enregistrés',
      description: 'Vos préférences de notification ont été mises à jour.',
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 py-1 backdrop-blur-sm">
            <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-sm">Notifications</h1>
            <div className="w-5"></div>
        </header>

        <main className="p-4 md:p-8">
            <div className="mx-auto max-w-2xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell /> Notifications Push</CardTitle>
                        <CardDescription>Recevez des alertes en temps réel directement sur votre appareil.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="push-messages" className="text-sm">Nouveaux messages</Label>
                            <Switch id="push-messages" checked={pushNotifications.newMessages} onCheckedChange={(checked) => setPushNotifications(prev => ({...prev, newMessages: checked}))} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="push-visits" className="text-sm">Visites de profil</Label>
                            <Switch id="push-visits" checked={pushNotifications.profileVisits} onCheckedChange={(checked) => setPushNotifications(prev => ({...prev, profileVisits: checked}))} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="push-matches" className="text-sm">Nouveaux matches</Label>
                            <Switch id="push-matches" checked={pushNotifications.newMatches} onCheckedChange={(checked) => setPushNotifications(prev => ({...prev, newMatches: checked}))} />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Mail /> Notifications par e-mail</CardTitle>
                        <CardDescription>Recevez des résumés et des actualités dans votre boîte de réception.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="email-news" className="text-sm">Promotions & actualités</Label>
                            <Switch id="email-news" checked={emailNotifications.newsAndUpdates} onCheckedChange={(checked) => setEmailNotifications(prev => ({...prev, newsAndUpdates: checked}))} />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="email-digest" className="text-sm">Résumé hebdomadaire</Label>
                            <Switch id="email-digest" checked={emailNotifications.weeklyDigest} onCheckedChange={(checked) => setEmailNotifications(prev => ({...prev, weeklyDigest: checked}))} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSubmitting}>
                         {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                         ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer les modifications
                            </>
                         )}
                    </Button>
                </div>
            </div>
        </main>
    </div>
  );
}
