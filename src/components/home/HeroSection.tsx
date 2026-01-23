import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-volunteers.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero pt-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Join 50,000+ changemakers
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              Transform Lives,{" "}
              <span className="text-gradient">One Act of</span>{" "}
              <span className="text-gradient">Kindness</span> at a Time
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              KindConnect bridges the gap between compassionate hearts and meaningful causes. 
              Whether you want to volunteer your time or donate to verified NGOs, 
              every action creates ripples of positive change.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/donate">
                <Button variant="hero" size="lg">
                  Start Donating
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/volunteer">
                <Button variant="outline" size="lg">
                  <Play className="w-5 h-5" />
                  Become a Volunteer
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">₹10Cr+</div>
                <div className="text-sm text-muted-foreground">Donations Raised</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Verified NGOs</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Active Volunteers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-fade-up delay-200">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Volunteers making a difference"
                className="rounded-3xl shadow-strong object-cover w-full aspect-[4/3]"
              />
              
              {/* Floating Cards */}
              <div className="absolute -left-6 top-1/4 glass rounded-2xl p-4 shadow-medium animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">2,847</div>
                    <div className="text-xs text-muted-foreground">Lives Changed Today</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-1/4 glass rounded-2xl p-4 shadow-medium animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">+128</div>
                    <div className="text-xs text-muted-foreground">New Volunteers</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute -z-10 -top-6 -right-6 w-full h-full rounded-3xl gradient-primary opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
