
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
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

        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <h3 className="font-bold text-lg drop-shadow-md">{profile.name}, {profile.age}</h3>
        </div>
      </Card>
    </Link>
  );
};

export default ProfileCard;
