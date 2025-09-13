
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Backpack, Coins, Globe, Languages, ShieldCheck, Star, Users, BriefcaseBusiness } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
}

const intentionMap = {
  'Je peux sponsoriser': { icon: BriefcaseBusiness, color: 'bg-green-500', text: 'Sponsor' },
  'Je cherche un voyage sponsorisé': { icon: Coins, color: 'bg-yellow-500', text: 'Seeking Sponsor' },
  'Partager les frais (50/50)': { icon: Users, color: 'bg-blue-500', text: '50/50' },
  'Voyage de groupe': { icon: Users, color: 'bg-red-500', text: 'Group' },
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
      <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold font-headline">{profile.name}, {profile.age}</h3>
          {profile.verified && <ShieldCheck className="h-6 w-6 text-green-400" />}
        </div>
        <p className="mt-1 text-sm font-light text-neutral-200 line-clamp-2">{profile.bio}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
            {intention && (
                <Badge variant="default" className={`border-none text-white ${intention.color}`}>
                    <intention.icon className="mr-1 h-3 w-3" />
                    {intention.text}
                </Badge>
            )}
            <Badge variant="secondary">
                <Backpack className="mr-1 h-3 w-3" />
                {profile.travelStyle}
            </Badge>
        </div>

        <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-neutral-300" />
                <span className="truncate">{profile.dreamDestinations.join(', ')}</span>
            </div>
             <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-neutral-300" />
                <span className="truncate">{profile.interests.join(', ')}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
