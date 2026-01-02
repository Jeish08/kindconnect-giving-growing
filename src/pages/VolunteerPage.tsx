import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Users, Filter, ArrowRight } from "lucide-react";

const volunteerOpportunities = [
  {
    id: 1,
    title: "Community Kitchen Helper",
    organization: "Food for All Foundation",
    location: "New York, NY",
    time: "Weekends, 9 AM - 1 PM",
    spots: 12,
    type: "In-Person",
    urgent: true,
    description: "Help prepare and serve meals to those in need at our community kitchen.",
    skills: ["Cooking", "Food Safety", "Customer Service"],
  },
  {
    id: 2,
    title: "Online Tutoring Mentor",
    organization: "Bright Future Academy",
    location: "Remote",
    time: "Flexible Hours",
    spots: 25,
    type: "Virtual",
    urgent: false,
    description: "Provide one-on-one tutoring sessions to students in math, science, or English.",
    skills: ["Teaching", "Patience", "Subject Expertise"],
  },
  {
    id: 3,
    title: "Environmental Cleanup Leader",
    organization: "Green Earth Initiative",
    location: "Los Angeles, CA",
    time: "Saturdays, 7 AM - 11 AM",
    spots: 8,
    type: "In-Person",
    urgent: true,
    description: "Lead beach and park cleanup crews to protect local ecosystems.",
    skills: ["Leadership", "Environmental Awareness", "Physical Fitness"],
  },
  {
    id: 4,
    title: "Senior Tech Support",
    organization: "Digital Bridge",
    location: "Chicago, IL",
    time: "Tuesdays & Thursdays, 2 PM - 5 PM",
    spots: 15,
    type: "Hybrid",
    urgent: false,
    description: "Help seniors learn to use smartphones, tablets, and computers.",
    skills: ["Tech Savvy", "Patience", "Communication"],
  },
  {
    id: 5,
    title: "Animal Shelter Assistant",
    organization: "Paws & Hearts Rescue",
    location: "Austin, TX",
    time: "Flexible",
    spots: 20,
    type: "In-Person",
    urgent: false,
    description: "Care for shelter animals, assist with adoptions, and help with daily operations.",
    skills: ["Animal Care", "Compassion", "Reliability"],
  },
  {
    id: 6,
    title: "Crisis Hotline Counselor",
    organization: "Hope Foundation",
    location: "Remote",
    time: "Evening Shifts Available",
    spots: 10,
    type: "Virtual",
    urgent: true,
    description: "Provide emotional support to individuals in crisis via phone and text.",
    skills: ["Active Listening", "Empathy", "Crisis Training"],
  },
];

const types = ["All", "In-Person", "Virtual", "Hybrid"];

const VolunteerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredOpportunities = volunteerOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || opp.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-sage/20 text-sage text-sm font-medium">
                Make a Difference
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Volunteer Opportunities
              </h1>
              <p className="text-lg text-muted-foreground">
                Find meaningful ways to contribute your time and skills to causes you care about.
                Every hour makes an impact.
              </p>

              {/* Search */}
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Types */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedType === type
                      ? "gradient-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredOpportunities.length}</span> opportunities
              </p>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {/* Opportunities List */}
            <div className="space-y-6">
              {filteredOpportunities.map((opp, index) => (
                <div
                  key={opp.id}
                  className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            opp.type === "Virtual"
                              ? "bg-sage/20 text-sage"
                              : opp.type === "In-Person"
                              ? "bg-primary/10 text-primary"
                              : "bg-gold/20 text-gold"
                          }`}
                        >
                          {opp.type}
                        </span>
                        {opp.urgent && (
                          <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                            Urgent Need
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{opp.title}</h3>
                        <p className="text-primary font-medium">{opp.organization}</p>
                      </div>

                      <p className="text-muted-foreground">{opp.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {opp.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {opp.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          {opp.spots} spots left
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {opp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                      <Link to="/auth">
                        <Button variant="hero" size="lg">
                          Apply Now
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No opportunities found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VolunteerPage;
