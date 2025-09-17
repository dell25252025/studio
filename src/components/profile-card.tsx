
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Backpack, Coins, Globe, MapPin, ShieldCheck, Star, Users, BriefcaseBusiness, UserPlus, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ProfileCardProps {
  profile: UserProfile;
}

const intentionMap: { [key: string]: { icon: React.ElementType, color: string, text: string } } = {
  'Sponsor': { icon: BriefcaseBusiness, color: 'bg-green-500', text: 'Sponsor' },
  'Sponsorisé': { icon: Coins, color: 'bg-yellow-500', text: 'Sponsorisé' },
  '50/50': { icon: Users, color: 'bg-blue-500', text: '50/50' },
  'Groupe': { icon: Users, color: 'bg-red-500', text: 'Groupe' },
  'Toutes': { icon: Users, color: 'bg-gray-500', text: 'Toutes'},
};


const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
    const intention = intentionMap[profile.travelIntention];
  return (
    <Card className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-0 shadow-xl group">
      <Image
        src={profile.image}
        alt={profile.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        data-ai-hint="person portrait"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute top-2 right-2">
         {profile.verified && <ShieldCheck className="h-6 w-6 text-green-400 drop-shadow-lg" />}
      </div>
      
      <div className="absolute top-2 left-2">
        <Button size="icon" variant="outline" className="rounded-full bg-black/20 text-white border-white/50 h-9 w-9 backdrop-blur-sm">
            <UserPlus className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className='md:hidden'>
          <h3 className="text-lg font-bold font-headline drop-shadow-md text-center">{profile.name}, {profile.age}</h3>
          
          {intention && (
              <div className="flex justify-center mt-1">
                <Badge variant="default" className={cn("border-none text-white", intention.color)}>
                    <intention.icon className="mr-1 h-3 w-3" />
                    {intention.text}
                </Badge>
              </div>
          )}
        </div>
        <div className="hidden md:block mb-2">
            <h3 className="text-2xl font-bold font-headline drop-shadow-md">{profile.name}, {profile.age}</h3>
            {intention && (
                <Badge variant="default" className={cn("border-none text-white mt-1.5", intention.color)}>
                    <intention.icon className="mr-1 h-3 w-3" />
                    {intention.text}
                </Badge>
            )}
        </div>
        
        <div className="mt-2 space-y-1 text-[11px] md:text-sm font-light">
            <div className="flex items-center gap-2 drop-shadow-sm">
                <MapPin className="h-4 w-4 text-neutral-300" />
                <span className="truncate">Habite à {profile.location}</span>
            </div>
            <div className="flex items-center gap-2 drop-shadow-sm">
                <Globe className="h-4 w-4 text-neutral-300" />
                <span className="truncate">Destination: {profile.dreamDestinations.join(', ')}</span>
            </div>
             <div className="flex items-center gap-2 drop-shadow-sm">
                <Backpack className="h-4 w-4 text-neutral-300" />
                <span className="truncate">Style: {profile.travelStyle}</span>
            </div>
             <div className="flex items-center gap-2 drop-shadow-sm">
                <Star className="h-4 w-4 text-neutral-300" />
                <span className="truncate">Activités: {profile.interests.join(', ')}</span>
            </div>
        </div>

        <Button className="w-full mt-3 md:mt-4 bg-white/90 text-black hover:bg-white backdrop-blur-sm text-xs md:text-sm h-9 md:h-10">
            <Send className="mr-2 h-4 w-4"/>
            Envoyer un message
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
