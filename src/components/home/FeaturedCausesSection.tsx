import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Users } from "lucide-react";
import causeElderly from "@/assets/cause-elderly.jpg";
import causeEducation from "@/assets/cause-education.jpg";
import causeWater from "@/assets/cause-water.jpg";

const causes = [
  {
    id: 1,
    title: "Senior Care Initiative",
    description: "Providing companionship and essential services to elderly community members living alone.",
    image: causeElderly,
    raised: 45000,
    goal: 75000,
    donors: 234,
    category: "Elderly Care",
  },
  {
    id: 2,
    title: "Education for Every Child",
    description: "Supplying educational materials and building schools in underserved communities worldwide.",
    image: causeEducation,
    raised: 128500,
    goal: 150000,
    donors: 1847,
    category: "Education",
  },
  {
    id: 3,
    title: "Clean Water Project",
    description: "Building sustainable water wells and filtration systems in water-scarce regions.",
    image: causeWater,
    raised: 89000,
    goal: 100000,
    donors: 956,
    category: "Clean Water",
  },
];

const FeaturedCausesSection = () => {
  return (
    <section className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Featured Campaigns
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Causes That Need You
            </h2>
          </div>
          <Link to="/causes">
            <Button variant="ghost" className="group">
              View All Causes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Causes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause, index) => (
            <Link
              key={cause.id}
              to={`/causes/${cause.id}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 border border-border/50">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={cause.image}
                    alt={cause.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground">
                      {cause.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cause.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {cause.description}
                  </p>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Progress
                      value={(cause.raised / cause.goal) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground">
                        ₹{cause.raised.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of ₹{cause.goal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Users className="w-4 h-4" />
                      <span>{cause.donors} donors</span>
                    </div>
                    <Button variant="hero" size="sm">
                      Donate
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCausesSection;
