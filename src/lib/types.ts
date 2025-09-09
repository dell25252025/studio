export type TravelIntention = 'Sponsor' | 'Seeking Sponsorship' | '50/50' | 'Group';

export type UserProfile = {
  id: number;
  name: string;
  age: number;
  sex: 'Homme' | 'Femme' | 'Non-binaire';
  bio: string;
  travelStyle: 'Luxe' | 'Adventure' | 'Backpacking' | 'Relaxation' | 'Cultural' | 'Aventure / Sac à dos' | 'Luxe / Détente' | 'Culturel / Historique' | 'Festif / Événementiel' | 'Religieux / Spirituel';
  dreamDestinations: string[];
  languagesSpoken: string[];
  travelIntention: TravelIntention | 'Partager les frais (50/50)' | 'Je peux sponsoriser le voyage' | 'Je cherche un voyage sponsorisé' | 'Organiser un voyage de groupe';
  interests: string[];
  verified: boolean;
  image: string;
};
