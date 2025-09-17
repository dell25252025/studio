
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card className="relative aspect-square w-full overflow-hidden rounded-xl border-0 shadow-lg group">
      <Image
        src={profile.image}
        alt={profile.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        data-ai-hint="person portrait"
      />
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
        <div className='inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-black rounded-full px-3 py-1 shadow-md'>
          <h3 className="text-xs font-bold truncate">{profile.name}, {profile.age}</h3>
          {profile.verified && <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0" fill="currentColor" />}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
