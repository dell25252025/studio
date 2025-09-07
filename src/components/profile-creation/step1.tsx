
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

const Step1 = () => {
  const { control, watch, setValue } = useFormContext();
  const photos = watch('photos') || [];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 5 - photos.length;
    const filesToUpload = files.slice(0, remainingSlots);

    filesToUpload.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setValue('photos', [...watch('photos'), reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setValue('photos', newPhotos);
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
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de naissance</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: fr })
                      ) : (
                        <span>Choisissez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
               <p className="text-sm text-muted-foreground">Votre âge sera affiché publiquement, pas votre date de naissance.</p>
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
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ajoutez vos meilleures photos</FormLabel>
              <FormControl>
                 <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <label className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                        <div className="text-center">
                            <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Ajouter</span>
                        </div>
                        <input type="file" className="sr-only" multiple accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  )}
                 </div>
              </FormControl>
               <p className="text-sm text-muted-foreground">Votre première photo sera votre photo de profil principale. Montrez votre côté voyageur !</p>
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
