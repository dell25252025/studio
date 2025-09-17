
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Link href={`/profile?id=${profile.id}`} passHref>
      <Card className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-0 shadow-lg group cursor-pointer">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="person portrait"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-2 left-2 right-2 text-white">
          <div className='flex items-center gap-1.5'>
            <h3 className="text-lg font-bold truncate">{profile.name}, {profile.age}</h3>
            {profile.verified && <ShieldCheck className="h-5 w-5 text-white flex-shrink-0" fill="currentColor" />}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProfileCard;
