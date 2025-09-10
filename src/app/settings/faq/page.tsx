
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
  {
    question: 'Comment fonctionne WanderLink ?',
    answer: 'WanderLink est une application conçue pour vous aider à trouver des partenaires de voyage compatibles. Vous créez un profil, spécifiez vos destinations de rêve et votre style de voyage, et notre algorithme (y compris une IA) vous suggère des profils avec qui vous pourriez bien vous entendre pour votre prochaine aventure.',
  },
  {
    question: 'Comment fonctionne le matching par IA ?',
    answer: "Notre fonctionnalité de matching par IA analyse en profondeur votre profil, vos intérêts, votre style de voyage et vos intentions pour les comparer avec d\'autres utilisateurs. L\'IA évalue la compatibilité sur plusieurs niveaux pour vous proposer les partenaires de voyage les plus pertinents et augmenter vos chances de trouver le compagnon idéal.",
  },
  {
    question: 'Mon profil est-il visible par tout le monde ?',
    answer: "Vous avez le contrôle total sur la visibilité de votre profil. Dans les \'Paramètres de confidentialité\', vous pouvez choisir de rendre votre profil visible à tout le monde, uniquement aux membres de WanderLink, ou de le cacher temporairement.",
  },
  {
    question: 'La vérification de profil est-elle obligatoire ?',
    answer: "La vérification n\'est pas obligatoire, mais elle est fortement recommandée. Un profil vérifié augmente la confiance au sein de la communauté et montre aux autres utilisateurs que vous êtes une personne réelle et sérieuse. Les profils vérifiés ont généralement plus de succès.",
  },
  {
    question: 'Que signifient les intentions de voyage comme "Sponsor" ou "50/50" ?',
    answer: "Ces options définissent l'arrangement financier pour le voyage. \'Partager les frais (50/50)\' signifie que les coûts sont partagés. \'Je peux sponsoriser\' signifie que vous êtes prêt à couvrir la majorité des frais. \'Je cherche un voyage sponsorisé\' signifie que vous cherchez un partenaire qui peut financer le voyage. \'Voyage de groupe\' est pour organiser un voyage avec plusieurs personnes.",
  },
];

export default function FaqPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-secondary/30 pt-12">
        <main className="space-y-6 px-2 py-4 md:px-4">
            <div className="mx-auto max-w-2xl space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HelpCircle /> Questions fréquentes</CardTitle>
                        <CardDescription>Trouvez ici les réponses aux questions les plus courantes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqItems.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-sm">{item.question}</AccordionTrigger>
                                    <AccordionContent className="text-xs text-muted-foreground">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
