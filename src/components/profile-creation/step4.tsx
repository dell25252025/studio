
'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
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
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const activities = [
    { id: 'hiking', label: 'Randonnée' },
    { id: 'beach', label: 'Plage' },
    { id: 'museums', label: 'Musées' },
    { id: 'concerts', label: 'Concerts / Festivals' },
    { id: 'food', label: 'Gastronomie' },
    { id: 'nightlife', label: 'Sorties nocturnes' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'yoga', label: 'Yoga / Méditation' },
    { id: 'sport', label: 'Sport' },
]

const Step4 = () => {
  const { control } = useFormContext();
  const areDatesFlexible = useWatch({
    control,
    name: 'flexibleDates',
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-headline">Où partons-nous ?</h2>
        <p className="text-muted-foreground">C'est la partie la plus importante ! Décrivez votre projet pour trouver des partenaires.</p>
      </div>
      <div className="space-y-4">
        <FormField
          control={control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Je veux aller à...</FormLabel>
              <FormControl>
                <Input placeholder="Ville, Pays (Ex: Bangkok, Thaïlande)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="dates"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Quand ?</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value?.from && !areDatesFlexible && 'text-muted-foreground'
                    )}
                    disabled={areDatesFlexible}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {areDatesFlexible ? (
                        'Dates flexibles'
                    ) : field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, 'LLL dd, y', { locale: fr })} -{' '}
                          {format(field.value.to, 'LLL dd, y', { locale: fr })}
                        </>
                      ) : (
                        format(field.value.from, 'LLL dd, y', { locale: fr })
                      )
                    ) : (
                      <span>Choisissez une période</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value as DateRange}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                    locale={fr}
                    disabled={areDatesFlexible}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={control}
            name="flexibleDates"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    Mes dates sont flexibles
                    </FormLabel>
                </div>
                </FormItem>
            )}
        />
        <FormField
          control={control}
          name="travelStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mon style de voyage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Aventure / Sac à dos">Aventure / Sac à dos</SelectItem>
                  <SelectItem value="Luxe / Détente">Luxe / Détente</SelectItem>
                  <SelectItem value="Culturel / Historique">Culturel / Historique</SelectItem>
                  <SelectItem value="Festif / Événementiel">Festif / Événementiel</SelectItem>
                  <SelectItem value="Religieux / Spirituel">Religieux / Spirituel</SelectItem>
                  <SelectItem value="Road Trip / Van Life">Road Trip / Van Life</SelectItem>
                  <SelectItem value="Humanitaire / Écovolontariat">Humanitaire / Écovolontariat</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={control}
            name="activities"
            render={() => (
                <FormItem>
                    <div className="mb-4">
                    <FormLabel className="text-base">J'aimerais faire...</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {activities.map((item) => (
                        <FormField
                            key={item.id}
                            control={control}
                            name="activities"
                            render={({ field }) => {
                            return (
                                <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value: string) => value !== item.id
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
          name="financialArrangement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mon intention</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une intention" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Partager les frais (50/50)">Partager les frais (50/50)</SelectItem>
                  <SelectItem value="Je peux sponsoriser le voyage">Je peux sponsoriser le voyage</SelectItem>
                  <SelectItem value="Je cherche un voyage sponsorisé">Je cherche un voyage sponsorisé</SelectItem>
                  <SelectItem value="Organiser un voyage de groupe">Organiser un voyage de groupe</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Step4;
