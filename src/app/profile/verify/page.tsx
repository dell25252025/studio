
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera as CameraIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsHeader } from '@/components/settings/settings-header';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export default function VerifyProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);

  const takePicture = async () => {
    if (!Capacitor.isPluginAvailable('Camera')) {
      toast({
        variant: 'destructive',
        title: 'Fonctionnalité non disponible',
        description: "L'appareil photo n'est pas accessible sur cet appareil.",
      });
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        direction: 'front',
      });

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if needed (like sending to a server).
      if (image.webPath) {
        setSelfie(image.webPath);
        // Here you would typically upload the image to your server
        // and create a verification request.
        console.log('Selfie taken:', image.webPath);
        toast({
            title: 'Selfie capturé !',
            description: "Maintenant, soumettez votre demande de vérification.",
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de caméra',
        description: "Impossible de prendre la photo. Veuillez vérifier les autorisations.",
      });
    }
  };

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    // Simulate API call to submit the verification request
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    toast({
      title: 'Demande de vérification envoyée !',
      description: "Nous examinerons votre demande dans les 24 heures.",
    });

    router.push('/profile'); // Redirect back to profile
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <SettingsHeader title="Vérification de Profil" />
      <main className="flex items-center justify-center min-h-[calc(100vh-3rem)] p-4 pt-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center items-center p-4">
            <CardTitle className="text-lg pt-2">
              Vérifiez votre profil
            </CardTitle>
            <CardDescription className="text-sm pt-1">
              Prenez un selfie en imitant la pose ci-dessous pour prouver que vous êtes bien la personne sur vos photos.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 p-4 pt-0">
            <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border">
                <Image 
                    src={placeholderImages.verificationPose.url}
                    alt={placeholderImages.verificationPose.alt}
                    fill
                    className="object-cover"
                    data-ai-hint={placeholderImages.verificationPose.hint}
                />
            </div>

            {selfie ? (
                <>
                    <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border-2 border-green-500">
                        <Image src={selfie} alt="Votre selfie" fill className="object-cover" />
                    </div>
                     <Button onClick={handleSubmitVerification} size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Soumettre ma vérification
                    </Button>
                    <Button onClick={() => setSelfie(null)} variant="outline" size="sm" disabled={isSubmitting}>
                        Reprendre la photo
                    </Button>
                </>
            ) : (
                <Button onClick={takePicture} size="lg" className="w-full">
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Prendre mon selfie
                </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
