
'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

const Step1 = () => {
  const { control, watch, setValue } = useFormContext();
  const profilePic = watch('profilePic');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setValue('profilePic', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removePhoto = () => {
    setValue('profilePic', null);
  };


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-headline">Créez votre profil</h2>
        <p className="text-muted-foreground">Commençons par les bases pour que les autres voyageurs puissent vous connaître.</p>
      </div>
      <div className="space-y-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Jean" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Âge</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex: 28"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Je suis...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Homme" />
                    </FormControl>
                    <FormLabel className="font-normal">Un Homme</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Femme" />
                    </FormControl>
                    <FormLabel className="font-normal">Une Femme</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Non-binaire" />
                    </FormControl>
                    <FormLabel className="font-normal">Non-binaire</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="profilePic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre photo de profil</FormLabel>
              <FormControl>
                 <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32">
                  {profilePic ? (
                      <div className="relative w-32 h-32">
                        <Image src={profilePic} alt="Photo de profil" layout="fill" className="object-cover rounded-full" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-7 w-7"
                          onClick={removePhoto}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-full cursor-pointer hover:bg-muted">
                          <div className="text-center">
                              <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Ajouter</span>
                          </div>
                          <input type="file" className="sr-only" accept="image/*" onChange={handlePhotoUpload} />
                      </label>
                    )}
                  </div>
                   <p className="text-sm text-muted-foreground">Montrez votre plus beau sourire ! C'est la première chose que les autres verront.</p>
                 </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ma description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez-vous en quelques mots : vos passions, ce que vous recherchez dans un partenaire de voyage..."
                  className="resize-none"
                  maxLength={500}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Step1;
