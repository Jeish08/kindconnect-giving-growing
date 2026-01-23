import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";

const opportunities = [
  {
    id: 1,
    title: "Community Kitchen Helper",
    organization: "Akshaya Patra Foundation",
    location: "Chennai, Tamil Nadu",
    time: "Weekends, 9 AM - 1 PM",
    spots: 12,
    type: "In-Person",
    urgent: true,
  },
  {
    id: 2,
    title: "Online Tutoring Mentor",
    organization: "Pratham Education Foundation",
    location: "Remote",
    time: "Flexible Hours",
    spots: 25,
    type: "Virtual",
    urgent: false,
  },
  {
    id: 3,
    title: "Environmental Cleanup Leader",
    organization: "Green Earth Kerala",
    location: "Kochi, Kerala",
    time: "Saturdays, 7 AM - 11 AM",
    spots: 8,
    type: "In-Person",
    urgent: true,
  },
  {
    id: 4,
    title: "Senior Tech Support",
    organization: "Digital Vidya Trust",
    location: "Bengaluru, Karnataka",
    time: "Tuesdays & Thursdays, 2 PM - 5 PM",
    spots: 15,
    type: "Hybrid",
    urgent: false,
  },
];

const VolunteerSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-sage/20 text-sage text-sm font-medium mb-4">
              Volunteer Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Lend Your Time, Change Lives
            </h2>
          </div>
          <Link to="/volunteer">
            <Button variant="ghost" className="group">
              Browse All Opportunities
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities.map((opp, index) => (
            <Link
              key={opp.id}
              to={`/volunteer/${opp.id}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-border/50 flex flex-col sm:flex-row gap-6">
                {/* Left Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      opp.type === "Virtual" 
                        ? "bg-sage/20 text-sage" 
                        : opp.type === "In-Person"
                        ? "bg-primary/10 text-primary"
                        : "bg-gold/20 text-gold"
                    }`}>
                      {opp.type}
                    </span>
                    {opp.urgent && (
                      <span className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {opp.organization}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {opp.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {opp.time}
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{opp.spots} spots left</span>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:variant-hero">
                    Apply Now
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
