import { Heart, Globe, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Heart,
    value: "₹10Cr+",
    label: "Total Donations",
    description: "Raised for causes worldwide",
  },
  {
    icon: Globe,
    value: "45+",
    label: "Countries",
    description: "Impacted by our community",
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Volunteers",
    description: "Making a difference daily",
  },
  {
    icon: TrendingUp,
    value: "500+",
    label: "NGOs",
    description: "Verified and trusted",
  },
];

const ImpactStatsSection = () => {
  return (
    <section className="py-24 gradient-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-4">
            Our Global Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Together, We're Making a Difference
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Every donation, every volunteer hour, every act of kindness adds up to create meaningful change.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-coral" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-primary-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-primary-foreground/60 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStatsSection;
