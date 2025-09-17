
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-0 shadow-lg group">
      <Image
        src={profile.image}
        alt={profile.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        data-ai-hint="person portrait"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      <CardContent className="absolute bottom-0 left-0 right-0 p-2 text-white">
        <div className='flex items-center justify-start gap-1.5'>
          <h3 className="text-sm font-bold drop-shadow-md truncate">{profile.name}, {profile.age}</h3>
          {profile.verified && <ShieldCheck className="h-4 w-4 text-blue-400 drop-shadow-lg flex-shrink-0" fill="currentColor" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
