import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";

const benefits = [
  "Access to a network of verified donors and volunteers",
  "Transparent donation tracking and reporting tools",
  "Dedicated support for campaign management",
  "Free platform with no hidden fees",
];

const NGOSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-medium">
              For NGOs & Organizations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Register Your NGO and Amplify Your Impact
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join hundreds of verified NGOs on KindConnect. Get access to passionate donors, 
              dedicated volunteers, and powerful tools to manage your campaigns effectively.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/ngo-register">
                <Button variant="navy" size="lg">
                  Register Your NGO
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative">
            <div className="bg-card rounded-3xl p-8 shadow-medium border border-border/50">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-navy flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">NGO Dashboard</h3>
                    <p className="text-muted-foreground text-sm">Manage everything in one place</p>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Raised", value: "$145,230" },
                    { label: "Active Volunteers", value: "234" },
                    { label: "Campaigns", value: "12" },
                    { label: "Donors", value: "1,847" },
                  ].map((stat, index) => (
                    <div key={index} className="bg-muted/50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Action Preview */}
                <div className="flex gap-3">
                  <div className="flex-1 h-10 rounded-lg bg-primary/10" />
                  <div className="flex-1 h-10 rounded-lg bg-muted" />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full rounded-3xl gradient-warm opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NGOSection;
