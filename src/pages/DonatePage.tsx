import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Users, Share2, CreditCard, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import causeEducation from "@/assets/cause-education.jpg";

const donationAmounts = [25, 50, 100, 250, 500, 1000];

const DonatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isMonthly, setIsMonthly] = useState(false);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const cause = {
    id: id || "1",
    title: "Education for Every Child",
    description:
      "Help us provide educational materials, build schools, and support teachers in underserved communities. Your donation directly impacts children's futures by giving them access to quality education.",
    image: causeEducation,
    raised: 128500,
    goal: 150000,
    donors: 1847,
    organization: "Bright Future Academy",
  };

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
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

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
                Your donation of ${finalAmount} to {cause.title} has been processed successfully.
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
                    src={cause.image}
                    alt={cause.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                      Education
                    </span>
                    <span>by {cause.organization}</span>
                  </div>

                  <h1 className="text-3xl font-bold text-foreground">{cause.title}</h1>
                  <p className="text-muted-foreground leading-relaxed">{cause.description}</p>

                  {/* Progress */}
                  <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
                    <Progress value={(cause.raised / cause.goal) * 100} className="h-3" />
                    <div className="flex justify-between">
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          ${cause.raised.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          raised of ${cause.goal.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {cause.donors.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">donors</div>
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
                  /* Payment Form */
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">Payment Details</h2>
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
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={paymentData.name}
                          onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="hello@example.com"
                          value={paymentData.email}
                          onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="card">Card Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="card"
                            placeholder="4242 4242 4242 4242"
                            value={paymentData.cardNumber}
                            onChange={(e) =>
                              setPaymentData({ ...paymentData, cardNumber: e.target.value })
                            }
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={paymentData.expiry}
                            onChange={(e) =>
                              setPaymentData({ ...paymentData, expiry: e.target.value })
                            }
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Complete Donation`}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                      <Lock className="w-3 h-3" />
                      Your payment is secured with 256-bit SSL encryption
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

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default DonatePage;
