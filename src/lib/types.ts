export type TravelIntention = 'Sponsor' | 'Seeking Sponsorship' | '50/50' | 'Group';

export type UserProfile = {
  id: number;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  bio: string;
  travelStyle: 'Luxe' | 'Adventure' | 'Backpacking' | 'Relaxation' | 'Cultural';
  dreamDestinations: string[];
  languagesSpoken: string[];
  travelIntention: TravelIntention;
  interests: string[];
  verified: boolean;
  image: string;
};
