import { About } from '@/components/landing/About';
import { EventInfo } from '@/components/landing/EventInfo';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { Statistics } from '@/components/landing/Statistics';
import { VIPGuests } from '@/components/landing/VIPGuests';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with full-screen design */}
      <Hero />

      {/* Event Information Cards */}
      <EventInfo />

      {/* Statistics Section */}
      <Statistics />

      {/* About Section */}
      <About />

      {/* VIP Guests Section */}
      <VIPGuests />

      {/* Footer */}
      <Footer />
    </div>
  );
}
