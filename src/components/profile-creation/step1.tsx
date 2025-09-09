
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '../ui/button';
import { Camera, Image as ImageIcon, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';

const MAX_PHOTOS = 4;

const Step1 = () => {
  const { control, setValue, getValues, trigger } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const currentPictures = getValues('profilePictures') || [];
    const newPictures: string[] = [];

    const filePromises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const results = await Promise.all(filePromises);
      const allPictures = [...currentPictures, ...results];
      setValue('profilePictures', allPictures.slice(0, MAX_PHOTOS), { shouldValidate: true });
    } catch (error) {
      console.error("Error reading files:", error);
    } finally {
      setIsUploading(false);
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePicture = (indexToRemove: number) => {
    const currentPictures = getValues('profilePictures');
    const newPictures = currentPictures.filter((_: any, index: number) => index !== indexToRemove);
    setValue('profilePictures', newPictures, { shouldValidate: true });
  };
  
  const pictures = getValues('profilePictures') || [];

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
          name="profilePictures"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Vos photos de profil (1 à 4)</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pictures.map((src: string, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <Image src={src} alt={`Aperçu ${index + 1}`} fill className="object-cover rounded-md" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removePicture(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {pictures.length < MAX_PHOTOS && (
                    <div 
                      className="aspect-square flex items-center justify-center border-2 border-dashed border-muted-foreground rounded-md cursor-pointer hover:bg-muted"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center text-muted-foreground">
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        ) : (
                          <>
                            <UploadCloud className="h-8 w-8 mx-auto" />
                            <span className="text-sm mt-2">Ajouter</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                 <FormControl>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
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
