
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filter Profiles</SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect travel partner.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pr-4 space-y-6">
           <div>
            <Label className="text-sm font-medium flex items-center mb-2">
              <Search className="h-4 w-4 mr-2" />
              Smart Search (AI Powered)
            </Label>
            <Textarea 
                placeholder="Describe your ideal travel partner... e.g., 'A photographer who loves hiking and is looking to explore Japan in the fall.'"
                className="h-24"
            />
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <Label htmlFor="gender-filter">Show me</Label>
              <RadioGroup defaultValue="all" id="gender-filter" className="flex items-center gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Men</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Women</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-binary" id="non-binary" />
                  <Label htmlFor="non-binary">Non-binary</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="intention-filter">Travel Intention</Label>
               <Select>
                <SelectTrigger id="intention-filter" className="w-full mt-2">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="50/50">50/50</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="seeking">Seeking Sponsorship</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="destination-filter">Destination</Label>
              <Input id="destination-filter" placeholder="e.g., Paris, France" className="mt-2" />
            </div>

             <div>
              <Label htmlFor="activities-filter">I'd like to do...</Label>
              <Input id="activities-filter" placeholder="e.g., Hiking, Museums..." className="mt-2" />
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Clear</Button>
          <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
