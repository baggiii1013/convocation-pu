import { Card } from "@/components/ui/Card";
import { notes, schedule } from "@/lib/data";
import { Calendar, MapPin, Users } from "lucide-react";

const EventDetails = () => {
  return (
    <section id="details" className="py-20 md:py-28 bg-gradient-secondary border-y border-border relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Event Details
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about the convocation day, from the schedule of events to 
            important guidelines for all attendees.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center bg-gradient-secondary border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300 group">
            <Calendar className="w-12 h-12 text-gold mb-4 mx-auto group-hover:drop-shadow-gold transition-all duration-300" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Date & Time</h3>
            <p className="text-muted-foreground mb-2">Friday, March 15, 2024</p>
            <p className="text-muted-foreground">10:00 AM - 4:00 PM</p>
          </Card>

          <Card className="p-8 text-center bg-gradient-secondary border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300 group">
            <MapPin className="w-12 h-12 text-gold mb-4 mx-auto group-hover:drop-shadow-gold transition-all duration-300" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Venue</h3>
            <p className="text-muted-foreground mb-2">University Auditorium</p>
            <p className="text-muted-foreground">Parul University Campus</p>
          </Card>

          <Card className="p-8 text-center bg-gradient-secondary border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300 group">
            <Users className="w-12 h-12 text-gold mb-4 mx-auto group-hover:drop-shadow-gold transition-all duration-300" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Attendees</h3>
            <p className="text-muted-foreground mb-2">Graduates, Faculty, and Guests</p>
            <p className="text-muted-foreground">Registration Required</p>
          </Card>
        </div>

        {/* Schedule */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10 text-foreground">Schedule of Events</h3>
          <div className="space-y-6 max-w-4xl mx-auto">
            {schedule.map((item, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300 group">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300 relative">
                      <item.icon className="w-8 h-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-gold rounded-full shadow-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-1">{item.event}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-gold-subtle text-gold-dark font-semibold border border-gold/20">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <Card className="mt-16 p-8 bg-gradient-secondary border-border hover:border-gold/20 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-gold-subtle rounded-full blur-2xl opacity-50"></div>
          <h3 className="text-2xl font-bold mb-6 text-foreground relative z-10">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {notes.map((note, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-gold">
                  <note.icon className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{note.title}</h4>
                  <p className="text-muted-foreground">{note.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default EventDetails;
