
import { Compass, Heart, MessageSquare, UserPlus, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const BottomNav = () => {
  const navItemsLeft = [
    { icon: Compass, label: 'Discover', href: '/', active: true },
    { icon: Heart, label: 'Matches', href: '#' },
  ];

  const navItemsRight = [
    { icon: MessageSquare, label: 'Messages', href: '#' },
    { icon: XCircle, label: 'Block', href: '#' },
  ];
  
  const profileItem = { icon: UserPlus, label: 'Profile', href: '/create-profile' };


  return (
    <nav className="fixed bottom-0 left-0 z-20 h-20 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItemsLeft.map((item) => (
          <Link href={item.href} key={item.label} passHref>
            <Button
              asChild
              variant="ghost"
              className={`inline-flex h-full w-full flex-col items-center justify-center px-5 rounded-none ${
                item.active ? 'text-primary' : 'text-muted-foreground'
              } hover:bg-secondary/50`}
            >
              <div>
                <item.icon className="h-6 w-6 mb-1 mx-auto" />
                <span className="text-xs font-body">{item.label}</span>
              </div>
            </Button>
          </Link>
        ))}

        {/* Profile Button in the middle */}
        <div className="flex items-center justify-center">
             <Link href={profileItem.href} passHref>
                <Button
                asChild
                variant="ghost"
                className="inline-flex h-16 w-16 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                <div>
                    <profileItem.icon className="h-8 w-8 mx-auto" />
                    <span className="text-xs font-body">{profileItem.label}</span>
                </div>
                </Button>
            </Link>
        </div>


        {navItemsRight.map((item) => (
          <Link href={item.href} key={item.label} passHref>
            <Button
              asChild
              variant="ghost"
              className={`inline-flex h-full w-full flex-col items-center justify-center px-5 rounded-none text-muted-foreground hover:bg-secondary/50`}
            >
              <div>
                <item.icon className="h-6 w-6 mb-1 mx-auto" />
                <span className="text-xs font-body">{item.label}</span>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
