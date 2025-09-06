import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Award, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-center bg-gradient-to-b from-background to-background/90">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-background border rounded-full -z-20" />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block px-4 py-2 mb-6 bg-gradient-gold-subtle text-gold-dark font-semibold rounded-full border border-gold/20 shadow-sm">
            Convocation Ceremony 2024
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
            Celebrating the Next Generation of Leaders
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Join us in honoring the hard work, dedication, and achievements of our graduating class as they embark on their future endeavors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-gradient-gold text-black border-0 shadow-gold-intense hover:shadow-gold-intense hover:scale-105 transition-all duration-300 font-semibold"
              >
                Register for Ceremony
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gold/30 text-foreground hover:bg-gradient-gold-subtle hover:border-gold transition-all duration-300"
            >
              Download Schedule
            </Button>
          </div>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-gold/40 hover:shadow-gold transition-all duration-300 group">
              <Calendar className="w-8 h-8 text-gold mb-3 mx-auto group-hover:drop-shadow-gold transition-all duration-300" />
              <h3 className="font-bold text-lg text-foreground">Date & Time</h3>
              <p className="text-muted-foreground text-sm">March 15, 2024, 10 AM</p>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-gold/40 hover:shadow-gold transition-all duration-300 group">
              <MapPin className="w-8 h-8 text-gold mb-3 mx-auto group-hover:drop-shadow-gold transition-all duration-300" />
              <h3 className="font-bold text-lg text-foreground">Venue</h3>
              <p className="text-muted-foreground text-sm">University Auditorium</p>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-gold/40 hover:shadow-gold transition-all duration-300 group">
              <Award className="w-8 h-8 text-gold mb-3 mx-auto group-hover:drop-shadow-gold transition-all duration-300" />
              <h3 className="font-bold text-lg text-foreground">Chief Guest</h3>
              <p className="text-muted-foreground text-sm">Dr. Evelyn Reed</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
