
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ShieldCheck, BriefcaseBusiness, Coins, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: UserProfile;
}

const intentionMap: { [key: string]: { icon: React.ElementType, color: string } } = {
  'Sponsor': { icon: BriefcaseBusiness, color: 'text-green-500' },
  'Sponsorisé': { icon: Coins, color: 'text-yellow-500' },
  '50/50': { icon: Users, color: 'text-blue-500' },
  'Groupe': { icon: Users, color: 'text-red-500' },
  'Toutes': { icon: Users, color: 'text-gray-500' },
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {profile.verified && (
            <div className="absolute top-2 right-2">
                <div className="h-6 w-6 rounded-full bg-green-500/80 flex items-center justify-center text-white backdrop-blur-sm">
                    <ShieldCheck className="h-3 w-3" />
                </div>
            </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
            <div className="flex items-center justify-between">
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-sm font-bold truncate">{profile.name}, {profile.age}</h3>
                </div>
                {intention && (
                    <div className="flex-shrink-0 ml-1">
                        <intention.icon className={cn("h-4 w-4", intention.color)} />
                    </div>
                )}
            </div>
        </div>

      </Card>
    </Link>
  );
};

export default ProfileCard;
