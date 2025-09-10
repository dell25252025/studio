import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer = () => {
  return (
    <footer className="w-full bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-logo bg-gradient-to-r from-gradient-start to-gradient-end text-transparent bg-clip-text">
              WanderLink
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect with fellow travelers, share experiences, and plan your next adventure together. Your journey starts here.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/discover" className="text-muted-foreground hover:text-primary">Discover</Link></li>
              <li><Link href="/#about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/#contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Newsletter</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest travel tips and stories.
            </p>
            <div className="mt-4 flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WanderLink. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
