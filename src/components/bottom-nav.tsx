import { Compass, Heart, MessageSquare, Backpack } from 'lucide-react';
import { Button } from './ui/button';

const BottomNav = () => {
  const navItems = [
    { icon: Compass, label: 'Discover', active: true },
    { icon: Heart, label: 'Matches' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Backpack, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-20 h-20 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={`inline-flex h-full flex-col items-center justify-center px-5 rounded-none ${
              item.active ? 'text-primary' : 'text-muted-foreground'
            } hover:bg-secondary/50`}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-body">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
