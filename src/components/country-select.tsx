'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { countries, type Country } from '@/lib/countries';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function CountrySelect({ value, onValueChange, disabled }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedCountry = countries.find((country) => country.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start h-8', !value && 'text-muted-foreground')}
          disabled={disabled}
        >
          {selectedCountry ? (
            <>
              <span className={`fi fi-${selectedCountry.code.toLowerCase()} mr-2`}></span>
              {selectedCountry.name}
            </>
          ) : (
            'Sélectionner'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Filtrer les pays..." />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup>
              {countries
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country: Country) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : country.name);
                      setOpen(false);
                    }}
                  >
                     <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === country.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span
                      className={`fi fi-${country.code.toLowerCase()} mr-2`}
                    ></span>
                    {country.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
