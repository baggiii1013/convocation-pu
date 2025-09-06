import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-secondary border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* University Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center relative">
                <span className="text-white font-bold text-xl">PU</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-gold rounded-full shadow-gold"></div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground">Parul University</h3>
                <p className="text-sm bg-gradient-to-r from-gold to-gold-muted bg-clip-text text-transparent font-medium">Excellence in Education</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Committed to providing world-class education and fostering innovation 
              across diverse academic disciplines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-3">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors">
                About University
              </a>
              <a href="#details" className="block text-muted-foreground hover:text-primary transition-colors">
                Event Details
              </a>
              <a href="https://paruluniversity.ac.in" className="block text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                University Website
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">P.O. Limda, Waghodia, Gujarat 391760</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-muted-foreground">+91 2668 260300</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-muted-foreground">convocation@paruluniversity.ac.in</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              <a 
                href="#" 
                aria-label="Facebook"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-gradient-gold hover:text-black hover:shadow-gold transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                aria-label="Twitter"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-gradient-gold hover:text-black hover:shadow-gold transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-gradient-gold hover:text-black hover:shadow-gold transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-gradient-gold hover:text-black hover:shadow-gold transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-muted-foreground text-sm">
              Stay updated with the latest news and announcements.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 Parul University. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
