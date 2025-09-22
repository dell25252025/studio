
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { BriefcaseBusiness, Coins, Users } from 'lucide-react';
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
};

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  // Use a default intention if none is provided to ensure the badge always shows.
  const intentionValue = profile.travelIntention || '50/50';
  const intention = intentionMap[intentionValue];

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
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-2 text-white w-full flex flex-col items-start justify-end text-left">
          {intention && (
            <div>
              <Badge variant="default" className={cn("border-none text-white text-[8px] h-auto px-1.5 py-0.5", intention.color)}>
                {intention.text}
              </Badge>
            </div>
          )}
          <div>
            <h3 className="font-bold text-[10px] drop-shadow-md">{profile.name}, {profile.age}</h3>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProfileCard;
