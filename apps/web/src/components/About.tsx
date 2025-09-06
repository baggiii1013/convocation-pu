import { Card } from "@/components/ui/Card";
import { stats } from "@/lib/data";

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-gradient-secondary border-y border-border relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            About Parul University
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A leading institution of higher education in Gujarat, India, committed to excellence 
            in teaching, research, and innovation across diverse academic disciplines.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 text-center bg-card/50 backdrop-blur border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:shadow-glow transition-all duration-300 relative">
                <stat.icon className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full shadow-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-gold bg-clip-text text-transparent">{stat.value}</h3>
              <p className="font-semibold text-foreground mb-1">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </Card>
          ))}
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Excellence in Education Since 2009
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Parul University stands as a beacon of educational excellence in Gujarat, offering 
                world-class education across engineering, medicine, management, pharmacy, and numerous 
                other disciplines.
              </p>
              <p>
                With state-of-the-art facilities, distinguished faculty, and a commitment to holistic 
                development, we prepare our students to excel in their chosen fields and contribute 
                meaningfully to society.
              </p>
              <p>
                Our convocation ceremony celebrates not just academic achievement, but the beginning 
                of our graduates&apos; journey as leaders, innovators, and changemakers in their respective fields.
              </p>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 bg-gradient-secondary border-border hover:border-gold/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-gold-subtle rounded-full blur-xl"></div>
              <h4 className="text-2xl font-bold mb-6 text-foreground relative z-10">Our Legacy</h4>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-gradient-gold rounded-full mt-2 flex-shrink-0 shadow-gold"></div>
                  <div>
                    <h5 className="font-semibold text-foreground">Research Excellence</h5>
                    <p className="text-muted-foreground text-sm">Leading research initiatives in healthcare, technology, and sustainability</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-gradient-gold rounded-full mt-2 flex-shrink-0 shadow-gold"></div>
                  <div>
                    <h5 className="font-semibold text-foreground">Industry Partnerships</h5>
                    <p className="text-muted-foreground text-sm">Strong collaborations with leading companies worldwide</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-gradient-gold rounded-full mt-2 flex-shrink-0 shadow-gold"></div>
                  <div>
                    <h5 className="font-semibold text-foreground">Global Recognition</h5>
                    <p className="text-muted-foreground text-sm">Internationally accredited programs and faculty</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/3 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default About;
