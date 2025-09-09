
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
import { Checkbox } from '@/components/ui/checkbox';

const allLanguages = [
    { id: 'fr', label: 'Français' },
    { id: 'en', label: 'Anglais' },
    { id: 'es', label: 'Espagnol' },
    { id: 'ar', label: 'Arabe' },
    { id: 'zh', label: 'Mandarin' },
    { id: 'hi', label: 'Hindi' },
    { id: 'bn', label: 'Bengali' },
    { id: 'pt', label: 'Portugais' },
    { id: 'ru', label: 'Russe' },
    { id: 'ja', label: 'Japonais' },
    { id: 'de', label: 'Allemand' },
    { id: 'jv', label: 'Javanais' },
    { id: 'ko', label: 'Coréen' },
    { id: 'te', label: 'Télougou' },
    { id: 'mr', label: 'Marathi' },
    { id: 'tr', label: 'Turc' },
    { id: 'ta', label: 'Tamoul' },
    { id: 'vi', label: 'Vietnamien' },
    { id: 'ur', label: 'Ourdou' },
    { id: 'it', label: 'Italien' },
    { id: 'th', label: 'Thaï' },
    { id: 'gu', label: 'Gujarati' },
    { id: 'fa', label: 'Persan' },
    { id: 'pl', label: 'Polonais' },
    { id: 'uk', label: 'Ukrainien' },
    { id: 'ro', label: 'Roumain' },
    { id: 'nl', label: 'Néerlandais' },
    { id: 'el', label: 'Grec' },
    { id: 'sv', label: 'Suédois' },
    { id: 'he', label: 'Hébreu' },
];


const Step2 = () => {
  const { control } = useFormContext();

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
            render={() => (
                <FormItem>
                    <div className="mb-4">
                    <FormLabel className="text-base">Langues que je parle</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2 border rounded-md">
                        {allLanguages.map((item) => (
                        <FormField
                            key={item.id}
                            control={control}
                            name="languages"
                            render={({ field }) => {
                            return (
                                <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(item.label)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...(field.value || []), item.label])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value: string) => value !== item.label
                                            )
                                            )
                                    }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {item.label}
                                </FormLabel>
                                </FormItem>
                            )
                            }}
                        />
                        ))}
                    </div>
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
