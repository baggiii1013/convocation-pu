import About from '@/components/About';
import EventDetails from '@/components/EventDetails';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VIPGuests from '@/components/VIPGuests';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* VIP Guests Section */}
        <VIPGuests />

        {/* Event Details Section */}
        <EventDetails />
      </main>

      <Footer />
    </div>
  );
}
