
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
import { MultiSelect } from '@/components/ui/multi-select';
import { useState } from 'react';

const allLanguages = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'Anglais' },
    { value: 'es', label: 'Espagnol' },
    { value: 'ar', label: 'Arabe' },
    { value: 'zh', label: 'Mandarin' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'pt', label: 'Portugais' },
    { value: 'ru', label: 'Russe' },
    { value: 'ja', label: 'Japonais' },
    { value: 'de', label: 'Allemand' },
    { value: 'jv', label: 'Javanais' },
    { value: 'ko', label: 'Coréen' },
    { value: 'te', label: 'Télougou' },
    { value: 'mr', label: 'Marathi' },
    { value: 'tr', label: 'Turc' },
    { value: 'ta', label: 'Tamoul' },
    { value: 'vi', label: 'Vietnamien' },
    { value: 'ur', label: 'Ourdou' },
    { value: 'it', label: 'Italien' },
    { value: 'th', label: 'Thaï' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'fa', label: 'Persan' },
    { value: 'pl', label: 'Polonais' },
    { value: 'uk', label: 'Ukrainien' },
    { value: 'ro', label: 'Roumain' },
    { value: 'nl', label: 'Néerlandais' },
    { value: 'el', label: 'Grec' },
    { value: 'sv', label: 'Suédois' },
    { value: 'he', label: 'Hébreu' },
];


const Step2 = () => {
  const { control, setValue } = useFormContext();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-headline">Parlez-nous de vous</h2>
        <p className="text-muted-foreground">Ces détails aideront les autres à trouver le compagnon de voyage idéal.</p>
      </div>
      <div className="space-y-4">
        <FormField
            control={control}
            name="languages"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Langues que je parle</FormLabel>
                     <MultiSelect
                        options={allLanguages}
                        selected={field.value || []}
                        onChange={(selected) => setValue('languages', selected, { shouldValidate: true })}
                        placeholder="Sélectionnez vos langues..."
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>J'habite à</FormLabel>
              <FormControl>
                <Input placeholder="Ville, Pays" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taille (en cm) <span className="text-muted-foreground">(optionnel)</span></FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 175" 
                  {...field} 
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Step2;
