
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { DocumentData } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface ReportAbuseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportedUser: DocumentData | null;
}

const reportReasons = [
  { id: 'spam', label: 'Spam ou publicité' },
  { id: 'harassment', label: 'Harcèlement ou discours haineux' },
  { id: 'inappropriate_content', label: 'Contenu inapproprié (nudité, violence...)' },
  { id: 'fake_profile', label: 'Faux profil ou usurpation d\'identité' },
  { id: 'scam', label: 'Escroquerie ou fraude' },
  { id: 'other', label: 'Autre' },
];

export function ReportAbuseDialog({ isOpen, onOpenChange, reportedUser }: ReportAbuseDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        variant: 'destructive',
        title: 'Veuillez sélectionner une raison',
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log({
      reportedUserId: reportedUser?.id,
      reason: selectedReason,
      details,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    setSelectedReason(null);
    setDetails('');
    
    toast({
      title: 'Signalement envoyé',
      description: `Merci. Nous allons examiner le profil de ${reportedUser?.firstName}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Signaler {reportedUser?.firstName || 'cet utilisateur'}</DialogTitle>
          <DialogDescription>
            Aidez-nous à garder WanderLink sécurisé. Les signalements sont anonymes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={selectedReason || ''} onValueChange={setSelectedReason}>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="font-normal">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
          <Textarea
            placeholder="Fournissez plus de détails (optionnel)..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Soumettre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
