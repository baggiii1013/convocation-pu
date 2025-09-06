import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { vipGuests } from "@/lib/data";
import { Award } from "lucide-react";

const VIPGuests = () => {
  return (
    <section id="guests" className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Distinguished Guests
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are honored to host a panel of esteemed leaders and innovators who will grace the 
            occasion with their presence and wisdom.
          </p>
        </div>

        {/* Guests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {vipGuests.map((guest, index) => (
            <Card key={index} className="p-8 bg-card/50 backdrop-blur border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-gold-subtle rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              
              {/* Role Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-gold rounded-full text-xs font-semibold text-background shadow-gold">
                {guest.role}
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                {/* Avatar with Icon */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-24 h-24 border-2 border-gold/20 shadow-glow group-hover:border-gold/40 transition-all duration-300">
                    <AvatarImage src={guest.image} alt={guest.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-primary text-white text-lg font-bold">
                      {guest.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {/* Icon Badge */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold group-hover:shadow-glow transition-all duration-300">
                    <guest.icon className="w-4 h-4 text-background" />
                  </div>
                </div>

                {/* Guest Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-gold transition-colors duration-300">
                      {guest.name}
                    </h3>
                    <p className="text-gold font-semibold text-sm mb-2">{guest.title}</p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {guest.bio}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-secondary border-gold/20 hover:border-gold/40 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-gold-subtle opacity-5"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Meet Our Distinguished Panel
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Join us for an inspiring ceremony where these remarkable leaders will share their wisdom 
                and celebrate our graduates&apos; achievements.
              </p>
              <div className="flex items-center justify-center space-x-2 text-gold font-semibold">
                <Award className="w-5 h-5" />
                <span>Excellence in Leadership</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default VIPGuests;
