import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground">
            Ready to Make a Difference?
          </h2>

          <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto">
            Join thousands of compassionate individuals who are creating positive change every day.
            Your journey of kindness starts here.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/donate">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-strong"
              >
                Start Donating Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button variant="hero-outline" size="xl">
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
