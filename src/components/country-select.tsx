
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CountrySelect({ value, onValueChange, disabled, className }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const selectedCountry = countries.find((country) => country.name === value);

  const triggerContent = (
    <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
      {selectedCountry ? (
        <>
          <span className={`fi fi-${selectedCountry.code.toLowerCase()} shrink-0`}></span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{selectedCountry.name}</span>
        </>
      ) : (
        <span className="text-muted-foreground">Sélectionner un pays</span>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-[200px] justify-start', className)}
            disabled={disabled}
          >
            {triggerContent}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <CountryList value={value} setOpen={setOpen} onValueChange={onValueChange} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-start', className)}
          disabled={disabled}
        >
          {triggerContent}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Select a country</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <CountryList value={value} setOpen={setOpen} onValueChange={onValueChange} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CountryList({
  value,
  setOpen,
  onValueChange
}: {
  value: string;
  setOpen: (open: boolean) => void;
  onValueChange: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filtrer les pays..." />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup>
          {countries.map((country) => (
            <CommandItem
              key={country.code}
              value={country.name}
              onSelect={(currentValue) => {
                // Find the country object based on the case-insensitive name from cmdk
                const selectedCountry = countries.find(c => c.name.toLowerCase() === currentValue);
                // Use the actual country name with correct casing
                onValueChange(selectedCountry ? selectedCountry.name : '');
                setOpen(false);
              }}
            >
               <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === country.name ? "opacity-100" : "opacity-0"
                )}
              />
              <div className="flex items-center gap-2">
                <span className={`fi fi-${country.code.toLowerCase()}`}></span>
                <span>{country.name}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
