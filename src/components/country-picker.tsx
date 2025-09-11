
'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { countries } from '@/lib/countries';

interface CountryPickerProps {
  onSelect: (country: string) => void;
}

export default function CountryPicker({ onSelect }: CountryPickerProps) {
  return (
    <DialogContent className="p-0">
      <DialogHeader className="px-4 pt-4">
        <DialogTitle>Sélectionnez un pays</DialogTitle>
      </DialogHeader>
      <Command>
        <CommandInput placeholder="Rechercher un pays..." />
        <CommandList className="max-h-[300px] overflow-y-auto p-1">
            <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => onSelect(country.name)}
                >
                  {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  );
}
