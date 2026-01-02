import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Target, Award, ArrowRight } from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We believe in the power of empathy and kindness to transform lives and communities.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building meaningful connections between volunteers, donors, and organizations worldwide.",
    },
    {
      icon: Target,
      title: "Impact",
      description: "Every action on our platform is designed to create measurable, lasting change.",
    },
    {
      icon: Award,
      title: "Transparency",
      description: "We maintain the highest standards of accountability and trust in all our operations.",
    },
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", initials: "SJ" },
    { name: "Michael Chen", role: "CTO", initials: "MC" },
    { name: "Emily Rodriguez", role: "Head of Partnerships", initials: "ER" },
    { name: "David Kim", role: "Head of Operations", initials: "DK" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Our Story
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Bridging Hearts with Causes
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                KindConnect was born from a simple belief: everyone has the capacity to make a 
                difference. We've built a platform that makes giving back accessible, transparent, 
                and impactful.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create a world where compassion knows no boundaries. We connect passionate 
                  individuals with verified organizations, ensuring every donation reaches its 
                  destination and every volunteer finds meaningful opportunities.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Since our founding in 2020, we've facilitated over $12 million in donations 
                  and connected more than 50,000 volunteers with causes they care about.
                </p>
                <div className="flex gap-4">
                  <Link to="/donate">
                    <Button variant="hero" size="lg">
                      Start Giving
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "$12M+", label: "Donations Raised" },
                  { value: "500+", label: "Verified NGOs" },
                  { value: "50K+", label: "Active Volunteers" },
                  { value: "45+", label: "Countries Served" },
                ].map((stat, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-muted-foreground">
                These principles guide everything we do at KindConnect.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 text-center">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Passionate individuals dedicated to making kindness go further.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {team.map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 gradient-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                Ready to Make a Difference?
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Join our community of changemakers today.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Join KindConnect
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
