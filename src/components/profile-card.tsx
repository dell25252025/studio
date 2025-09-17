
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UserPlus, MapPin, Globe, BriefcaseBusiness, Coins, Users, Star, Send } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface ProfileCardProps {
  profile: UserProfile;
}

const intentionMap: { [key: string]: { icon: React.ElementType, color: string, text: string } } = {
  'Sponsor': { icon: BriefcaseBusiness, color: 'bg-green-500', text: 'Sponsor' },
  'Sponsorisé': { icon: Coins, color: 'bg-yellow-500', text: 'Sponsorisé' },
  '50/50': { icon: Users, color: 'bg-blue-500', text: '50/50' },
  'Groupe': { icon: Users, color: 'bg-red-500', text: 'Groupe' },
  'Toutes': { icon: Users, color: 'bg-gray-500', text: 'Toutes' },
};

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  
  const intention = profile.travelIntention ? intentionMap[profile.travelIntention] : null;

  return (
    <Link href={`/profile?id=${profile.id}`} passHref>
      <Card className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-0 shadow-lg group cursor-pointer">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="person portrait"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Icons at the top */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-black/30 flex items-center justify-center text-white backdrop-blur-sm">
                <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
            </div>
        </div>
        {profile.verified && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3">
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-green-500/80 flex items-center justify-center text-white backdrop-blur-sm">
                    <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
                </div>
            </div>
        )}

        {/* Content at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white flex flex-col justify-end h-full">
            <div className="space-y-1 md:space-y-2">
                 <div>
                    <h3 className="text-xl md:text-3xl font-bold font-headline">{profile.name}, {profile.age}</h3>
                </div>
                {intention && (
                    <div className="mt-1">
                        <Badge variant="default" className={cn("border-none text-white text-xs md:text-sm", intention.color)}>
                            <intention.icon className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                            {intention.text}
                        </Badge>
                    </div>
                )}
            </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProfileCard;
