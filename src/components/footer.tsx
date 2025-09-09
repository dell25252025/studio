import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold font-headline mb-4">WanderLink</h3>
            <p className="text-sm text-muted-foreground">Trouvez votre prochain partenaire de voyage.</p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Accueil</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Découvrir</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Messagerie</Link></li>
              <li><Link href="/signup" className="text-muted-foreground hover:text-primary">S'inscrire</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Conditions d'utilisation</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Politique de confidentialité</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Politique sur les cookies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contactez-nous</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:contact@wanderlink.app" className="text-muted-foreground hover:text-primary">contact@wanderlink.app</a></li>
              <li><p className="text-muted-foreground">123 Rue du Voyage, 75001 Paris, France</p></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WanderLink. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
