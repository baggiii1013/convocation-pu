import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { navLinks } from "@/lib/data";
import { Menu } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header id="home" className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center relative">
            <span className="text-white font-bold text-xl">PU</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-gold rounded-full shadow-gold"></div>
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground">Parul University</h1>
            <p className="text-sm bg-gradient-to-r from-gold to-gold-muted bg-clip-text text-transparent font-medium">Convocation 2024</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button className="hidden sm:inline-flex bg-gradient-gold text-black border-0 shadow-gold hover:shadow-gold-intense hover:scale-105 transition-all duration-300 font-semibold">
              Sign In
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="font-medium text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
                <Link href="/login">
                  <Button className="w-full bg-gradient-gold text-black border-0 shadow-gold hover:shadow-gold-intense">
                    Sign In
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
