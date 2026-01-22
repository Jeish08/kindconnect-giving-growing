import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Users, Filter, ArrowRight } from "lucide-react";
import { useOpportunities, useApplyToOpportunity } from "@/hooks/useOpportunities";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Static fallback data
const staticOpportunities = [
  {
    id: "1",
    title: "Community Kitchen Helper",
    ngo: { name: "Food for All Foundation" },
    location: "New York, NY",
    start_datetime: null,
    end_datetime: null,
    slots_available: 12,
    is_active: true,
    description: "Help prepare and serve meals to those in need at our community kitchen.",
    skills_required: ["Cooking", "Food Safety", "Customer Service"],
    ngo_id: "",
    created_at: "",
  },
  {
    id: "2",
    title: "Online Tutoring Mentor",
    ngo: { name: "Bright Future Academy" },
    location: "Remote",
    start_datetime: null,
    end_datetime: null,
    slots_available: 25,
    is_active: true,
    description: "Provide one-on-one tutoring sessions to students in math, science, or English.",
    skills_required: ["Teaching", "Patience", "Subject Expertise"],
    ngo_id: "",
    created_at: "",
  },
  {
    id: "3",
    title: "Environmental Cleanup Leader",
    ngo: { name: "Green Earth Initiative" },
    location: "Los Angeles, CA",
    start_datetime: null,
    end_datetime: null,
    slots_available: 8,
    is_active: true,
    description: "Lead beach and park cleanup crews to protect local ecosystems.",
    skills_required: ["Leadership", "Environmental Awareness", "Physical Fitness"],
    ngo_id: "",
    created_at: "",
  },
];

const types = ["All", "In-Person", "Virtual", "Hybrid"];

const VolunteerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [applyDialog, setApplyDialog] = useState<{ open: boolean; opportunityId: string; title: string }>({
    open: false,
    opportunityId: "",
    title: "",
  });
  const [coverLetter, setCoverLetter] = useState("");

  const { data: dbOpportunities, isLoading } = useOpportunities();
  const applyMutation = useApplyToOpportunity();
  const { user } = useAuth();
  const { toast } = useToast();

  // Use database opportunities if available, otherwise use static data
  const opportunities = dbOpportunities && dbOpportunities.length > 0 
    ? dbOpportunities 
    : staticOpportunities;

  const getLocationType = (location: string | null) => {
    if (!location) return "Virtual";
    const loc = location.toLowerCase();
    if (loc === "remote" || loc.includes("online") || loc.includes("virtual")) return "Virtual";
    if (loc.includes("hybrid")) return "Hybrid";
    return "In-Person";
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.ngo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const locType = getLocationType(opp.location);
    const matchesType = selectedType === "All" || locType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleApply = (opportunityId: string, title: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for volunteer opportunities",
        variant: "destructive",
      });
      return;
    }
    setApplyDialog({ open: true, opportunityId, title });
  };

  const submitApplication = async () => {
    if (!user) return;

    try {
      await applyMutation.mutateAsync({
        opportunityId: applyDialog.opportunityId,
        volunteerId: user.id,
        coverLetter,
      });

      toast({
        title: "Application submitted!",
        description: "Your volunteer application has been submitted successfully.",
      });
      setApplyDialog({ open: false, opportunityId: "", title: "" });
      setCoverLetter("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message?.includes("duplicate") 
          ? "You have already applied to this opportunity" 
          : error.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  };

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

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}

            {/* Opportunities List */}
            <div className="space-y-6">
              {filteredOpportunities.map((opp, index) => {
                const locType = getLocationType(opp.location);
                return (
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
                              locType === "Virtual"
                                ? "bg-sage/20 text-sage"
                                : locType === "In-Person"
                                ? "bg-primary/10 text-primary"
                                : "bg-gold/20 text-gold"
                            }`}
                          >
                            {locType}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">{opp.title}</h3>
                          <p className="text-primary font-medium">{opp.ngo?.name || "Partner Organization"}</p>
                        </div>

                        <p className="text-muted-foreground">{opp.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {opp.location || "Remote"}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Flexible Hours
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {opp.slots_available} spots left
                          </div>
                        </div>

                        {/* Skills */}
                        {opp.skills_required && opp.skills_required.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {opp.skills_required.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                        <Button 
                          variant="hero" 
                          size="lg"
                          onClick={() => handleApply(opp.id, opp.title)}
                        >
                          Apply Now
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredOpportunities.length === 0 && !isLoading && (
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

      {/* Application Dialog */}
      <Dialog open={applyDialog.open} onOpenChange={(open) => setApplyDialog({ ...applyDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to Volunteer</DialogTitle>
            <DialogDescription>
              Apply for: {applyDialog.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Why do you want to volunteer? (optional)</Label>
              <Textarea
                id="coverLetter"
                placeholder="Share your motivation and any relevant experience..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setApplyDialog({ open: false, opportunityId: "", title: "" })}>
              Cancel
            </Button>
            <Button 
              variant="hero" 
              onClick={submitApplication}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VolunteerPage;
