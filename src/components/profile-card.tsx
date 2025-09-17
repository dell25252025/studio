
import Image from 'next/image';
import type { UserProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UserPlus, MapPin, Globe, Briefcase, Star, Send } from 'lucide-react';
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Icons at the top */}
        <div className="absolute top-3 left-3">
            <div className="h-9 w-9 rounded-full bg-black/30 flex items-center justify-center text-white backdrop-blur-sm">
                <UserPlus className="h-5 w-5" />
            </div>
        </div>
        {profile.verified && (
            <div className="absolute top-3 right-3">
                <div className="h-9 w-9 rounded-full bg-green-500/80 flex items-center justify-center text-white backdrop-blur-sm">
                    <ShieldCheck className="h-5 w-5" />
                </div>
            </div>
        )}

        {/* Content at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex flex-col justify-end h-full">
            <div className="space-y-3">
                 <div>
                    <h3 className="text-3xl font-bold font-headline">{profile.name}, {profile.age}</h3>
                </div>
                <div className="space-y-1.5 text-sm font-light">
                    {profile.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>Habite à {profile.location}</span>
                        </div>
                    )}
                    {profile.dreamDestinations?.[0] && (
                         <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 flex-shrink-0" />
                            <span>Destination: {profile.dreamDestinations[0]}</span>
                        </div>
                    )}
                    {profile.travelStyle && (
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 flex-shrink-0" />
                            <span>Style: {profile.travelStyle}</span>
                        </div>
                    )}
                    {profile.interests?.[0] && (
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 flex-shrink-0" />
                            <span>Activités: {profile.interests[0]}</span>
                        </div>
                    )}
                </div>
                 <Button 
                    className="w-full mt-3 bg-white/90 text-black hover:bg-white backdrop-blur-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        // Add messaging logic here
                        console.log(`Messaging ${profile.name}`);
                    }}
                >
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer un message
                </Button>
            </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProfileCard;
