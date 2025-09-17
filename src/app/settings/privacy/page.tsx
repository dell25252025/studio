
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, MessageSquare, Shield, Activity, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { SettingsHeader } from '@/components/settings/settings-header';

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for privacy settings - in a real app, this would come from user data
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showRecentActivity, setShowRecentActivity] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('all');
  const [messagingPolicy, setMessagingPolicy] = useState('all');

  const handleSave = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would save these settings to your database.
    console.log({
      showOnlineStatus,
      showRecentActivity,
      profileVisibility,
      messagingPolicy
    });
    
    setIsSubmitting(false);
    toast({
      title: 'Paramètres enregistrés',
      description: 'Vos préférences de confidentialité ont été mises à jour.',
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
        <SettingsHeader title="Paramètres de confidentialité" />
        <main className="px-2 py-4 md:px-4 pt-16">
            <div className="mx-auto max-w-2xl space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Eye /> Visibilité du profil</CardTitle>
                        <CardDescription>Contrôlez qui peut voir votre profil et vos informations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility} className="space-y-2">
                           <div className="flex items-center space-x-2">
                               <RadioGroupItem value="all" id="v-all" />
                               <Label htmlFor="v-all" className="text-sm">Visible par tout le monde</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                               <RadioGroupItem value="members" id="v-members" />
                               <Label htmlFor="v-members" className="text-sm">Visible uniquement par les membres WanderLink</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                               <RadioGroupItem value="hidden" id="v-hidden" />
                               <Label htmlFor="v-hidden" className="text-sm">Cacher mon profil temporairement</Label>
                           </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity /> Votre activité</CardTitle>
                        <CardDescription>Gérez la visibilité de votre statut en ligne et de votre activité.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="online-status" className="text-sm">Afficher mon statut "En ligne"</Label>
                            <Switch id="online-status" checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="recent-activity" className="text-sm">Afficher mon activité récente (ex: likes)</Label>
                            <Switch id="recent-activity" checked={showRecentActivity} onCheckedChange={setShowRecentActivity} />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Messagerie</CardTitle>
                        <CardDescription>Choisissez qui peut vous envoyer des messages.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={messagingPolicy} onValueChange={setMessagingPolicy} className="space-y-2">
                           <div className="flex items-center space-x-2">
                               <RadioGroupItem value="all" id="m-all" />
                               <Label htmlFor="m-all" className="text-sm">Tout le monde peut me contacter</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                               <RadioGroupItem value="matches" id="m-matches" />
                               <Label htmlFor="m-matches" className="text-sm">Seuls les profils avec qui j'ai "matché"</Label>
                           </div>
                        </RadioGroup>
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
