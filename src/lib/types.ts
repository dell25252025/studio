
export type TravelIntention = 'Sponsor' | 'Sponsorisé' | '50/50' | 'Groupe';

export type UserProfile = {
  id: number;
  name: string;
  age: number;
  sex: 'Homme' | 'Femme' | 'Autre';
  bio: string;
  location: string;
  travelStyle: 'Luxe' | 'Adventure' | 'Backpacking' | 'Relaxation' | 'Cultural' | 'Aventure / Sac à dos' | 'Luxe / Détente' | 'Culturel / Historique' | 'Festif / Événementiel' | 'Religieux / Spirituel';
  dreamDestinations: string[];
  languagesSpoken: string[];
  travelIntention: TravelIntention;
  interests: string[];
  verified: boolean;
  image: string;
};
