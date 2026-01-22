import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Users, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCause } from "@/hooks/useCauses";
import { useCreateDonation } from "@/hooks/useDonations";
import { useApprovedNGOs } from "@/hooks/useNGO";
import causeEducation from "@/assets/cause-education.jpg";

const donationAmounts = [25, 50, 100, 250, 500, 1000];

const DonatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createDonation = useCreateDonation();
  const { data: ngos } = useApprovedNGOs();
  const { data: fetchedCause, isLoading: causeLoading } = useCause(id || "");
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedNgoId, setSelectedNgoId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    isAnonymous: false,
  });

  // Use fetched cause or fallback to static data
  const cause = fetchedCause || {
    id: id || "1",
    title: "Education for Every Child",
    description:
      "Help us provide educational materials, build schools, and support teachers in underserved communities. Your donation directly impacts children's futures by giving them access to quality education.",
    image_url: causeEducation,
    raised_amount: 128500,
    target_amount: 150000,
    ngo_id: "",
    ngo: { name: "Bright Future Academy" },
  };

  // Set selected NGO when cause loads
  useEffect(() => {
    if (fetchedCause?.ngo_id) {
      setSelectedNgoId(fetchedCause.ngo_id);
    } else if (ngos && ngos.length > 0 && !selectedNgoId) {
      setSelectedNgoId(ngos[0].id);
    }
  }, [fetchedCause, ngos, selectedNgoId]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]);

  const finalAmount = selectedAmount || parseInt(customAmount) || 0;

  const handleDonate = () => {
    if (finalAmount < 5) {
      toast({
        title: "Minimum donation",
        description: "Minimum donation amount is $5",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNgoId && !fetchedCause?.ngo_id) {
      toast({
        title: "Error",
        description: "Please select an NGO to donate to",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDonation.mutateAsync({
        ngoId: fetchedCause?.ngo_id || selectedNgoId,
        causeId: fetchedCause?.id,
        amount: finalAmount,
        donorName: formData.name,
        donorEmail: formData.email,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
      });
      
      setStep(3);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
    }
  };

  if (causeLoading && id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            to="/causes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to causes
          </Link>

          {step === 3 ? (
            /* Success State */
            <div className="max-w-lg mx-auto text-center py-16 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-sage" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Thank You for Your Generosity!
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Your donation of ${finalAmount} to {cause.title} has been recorded successfully.
                You've made a real difference today.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="hero" onClick={() => navigate("/causes")}>
                  Explore More Causes
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left - Cause Info */}
              <div className="space-y-6">
                <div className="rounded-3xl overflow-hidden shadow-medium">
                  <img
                    src={cause.image_url || causeEducation}
                    alt={cause.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                      Cause
                    </span>
                    <span>by {cause.ngo?.name || "KindConnect Partner"}</span>
                  </div>

                  <h1 className="text-3xl font-bold text-foreground">{cause.title}</h1>
                  <p className="text-muted-foreground leading-relaxed">{cause.description}</p>

                  {/* Progress */}
                  <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
                    <Progress value={(Number(cause.raised_amount) / Number(cause.target_amount)) * 100} className="h-3" />
                    <div className="flex justify-between">
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          ${Number(cause.raised_amount).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          raised of ${Number(cause.target_amount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share */}
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right - Donation Form */}
              <div className="bg-card rounded-3xl p-8 shadow-medium border border-border/50 h-fit">
                {step === 1 ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Make a Donation</h2>

                    {/* Select NGO if no cause selected */}
                    {!fetchedCause && ngos && ngos.length > 0 && (
                      <div className="space-y-2">
                        <Label>Select Organization</Label>
                        <select
                          value={selectedNgoId}
                          onChange={(e) => setSelectedNgoId(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                        >
                          {ngos.map((ngo) => (
                            <option key={ngo.id} value={ngo.id}>
                              {ngo.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Monthly Toggle */}
                    <div className="flex p-1 bg-muted rounded-xl">
                      <button
                        onClick={() => setIsMonthly(false)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          !isMonthly ? "bg-card shadow text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        One-Time
                      </button>
                      <button
                        onClick={() => setIsMonthly(true)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          isMonthly ? "bg-card shadow text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        Monthly
                      </button>
                    </div>

                    {/* Amount Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {donationAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          className={`py-4 px-4 rounded-xl border-2 text-lg font-bold transition-all ${
                            selectedAmount === amount
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-foreground hover:border-primary/50"
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-2">
                      <Label>Custom Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          className="pl-8 h-12"
                          min="5"
                        />
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={handleDonate}
                      disabled={finalAmount < 5}
                    >
                      <Heart className="w-5 h-5" />
                      Donate ${finalAmount || 0}
                      {isMonthly ? "/month" : ""}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      100% of your donation goes directly to the cause.
                      <br />
                      Your donation is tax-deductible.
                    </p>
                  </div>
                ) : (
                  /* Donor Info Form */
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">Your Details</h2>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit amount
                      </button>
                    </div>

                    {/* Amount Summary */}
                    <div className="bg-muted/50 rounded-xl p-4 flex justify-between items-center">
                      <span className="text-muted-foreground">Donation Amount</span>
                      <span className="text-xl font-bold text-foreground">
                        ${finalAmount}
                        {isMonthly ? "/month" : ""}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="hello@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message (optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Leave a message of support..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={formData.isAnonymous}
                          onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                          className="rounded border-border"
                        />
                        <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                          Make my donation anonymous
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={createDonation.isPending}
                    >
                      {createDonation.isPending ? "Processing..." : "Complete Donation"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By donating, you agree to our terms and privacy policy.
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonatePage;
