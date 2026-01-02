import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Users, ArrowRight } from "lucide-react";
import causeEducation from "@/assets/cause-education.jpg";
import causeElderly from "@/assets/cause-elderly.jpg";
import causeWater from "@/assets/cause-water.jpg";

const categories = ["All", "Education", "Healthcare", "Environment", "Elderly Care", "Clean Water", "Food Security"];

const allCauses = [
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
  {
    id: 4,
    title: "Healthcare Access Fund",
    description: "Bringing medical supplies and healthcare professionals to remote communities.",
    image: causeEducation,
    raised: 67500,
    goal: 120000,
    donors: 512,
    category: "Healthcare",
  },
  {
    id: 5,
    title: "Green Earth Restoration",
    description: "Planting trees and restoring ecosystems in areas affected by deforestation.",
    image: causeWater,
    raised: 34000,
    goal: 80000,
    donors: 289,
    category: "Environment",
  },
  {
    id: 6,
    title: "Community Food Bank",
    description: "Providing nutritious meals to families facing food insecurity in urban areas.",
    image: causeElderly,
    raised: 52000,
    goal: 60000,
    donors: 678,
    category: "Food Security",
  },
];

const CausesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCauses = allCauses.filter((cause) => {
    const matchesSearch = cause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || cause.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Browse All Causes
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover verified campaigns and find causes that resonate with your heart.
                Every donation makes a difference.
              </p>

              {/* Search */}
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search causes..."
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
            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "gradient-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredCauses.length}</span> causes
              </p>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {/* Causes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCauses.map((cause, index) => (
                <Link
                  key={cause.id}
                  to={`/donate/${cause.id}`}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 border border-border/50">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
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
                        <Progress value={(cause.raised / cause.goal) * 100} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            ${cause.raised.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of ${cause.goal.toLocaleString()}
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
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCauses.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No causes found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}>
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

export default CausesPage;
