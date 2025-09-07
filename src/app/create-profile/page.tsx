
"use client";

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Step1 from '@/components/profile-creation/step1';
import Step2 from '@/components/profile-creation/step2';
import Step3 from '@/components/profile-creation/step3';
import Step4 from '@/components/profile-creation/step4';
import { Plane } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est obligatoire.'),
  age: z.number({ required_error: "L'âge est obligatoire." }).min(18, 'Vous devez avoir au moins 18 ans.'),
  gender: z.enum(['Homme', 'Femme', 'Non-binaire']),
  photos: z.array(z.string()).min(1, 'Veuillez ajouter au moins une photo.').max(5),
  bio: z.string().max(500, 'La description ne doit pas dépasser 500 caractères.').optional(),
  languages: z.array(z.string()).min(1, 'Veuillez sélectionner au moins une langue.'),
  location: z.string().min(1, 'La localisation est obligatoire.'),
  height: z.number().optional(),
  tobacco: z.enum(['Non-fumeur', 'Occasionnellement', 'Régulièrement']).optional(),
  alcohol: z.enum(['Jamais', 'Occasionnellement', 'Souvent']).optional(),
  destination: z.string().min(1, 'La destination est obligatoire.'),
  dates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
  flexibleDates: z.boolean().default(false),
  travelStyle: z.enum(['Aventure / Sac à dos', 'Luxe / Détente', 'Culturel / Historique', 'Festif / Événementiel', 'Religieux / Spirituel']),
  activities: z.array(z.string()).optional(),
  financialArrangement: z.enum(['Partager les frais (50/50)', 'Je peux sponsoriser le voyage', 'Je cherche un voyage sponsorisé', 'Organiser un voyage de groupe']),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: 'Qui êtes-vous ?', component: Step1, fields: ['firstName', 'age', 'gender', 'photos', 'bio'] },
  { id: 2, title: 'Votre profil voyageur', component: Step2, fields: ['languages', 'location', 'height'] },
  { id: 3, title: 'Style de vie', component: Step3, fields: ['tobacco', 'alcohol'] },
  { id: 4, title: 'Votre prochain voyage !', component: Step4, fields: ['destination', 'dates', 'flexibleDates', 'travelStyle', 'activities', 'financialArrangement'] },
];

export default function CreateProfilePage() {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      age: undefined,
      gender: undefined,
      photos: [],
      bio: '',
      languages: [],
      location: '',
      height: undefined,
      tobacco: undefined,
      alcohol: undefined,
      destination: '',
      dates: { from: undefined, to: undefined },
      activities: [],
      flexibleDates: false,
      travelStyle: undefined,
      financialArrangement: undefined,
    },
  });

  const { trigger, handleSubmit } = methods;

  const nextStep = async () => {
    const fields = steps[currentStep].fields as (keyof FormData)[];
    const isValid = await trigger(fields);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Profile data:', data);
    // Handle form submission, e.g., send to server
    alert('Profil créé avec succès !');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-2xl">
         <div className="flex items-center gap-2 mb-4 justify-center">
          <Plane className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline text-primary">
            WanderLink
          </h1>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-8" />
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CurrentStepComponent />

            <div className="mt-8 flex justify-between items-center">
              {currentStep > 0 ? (
                <Button type="button" variant="ghost" onClick={prevStep}>
                  Précédent
                </Button>
              ) : (
                <div />
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Suivant
                </Button>
              ) : (
                <Button type="submit">
                  Terminer et voir mon profil !
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
