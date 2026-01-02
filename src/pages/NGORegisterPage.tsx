import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ArrowLeft, Check, Upload, MapPin, Globe, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NGORegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
    description: "",
    mission: "",
    focusAreas: [] as string[],
    contactName: "",
    contactRole: "",
  });

  const focusAreaOptions = [
    "Education",
    "Healthcare",
    "Environment",
    "Poverty Alleviation",
    "Women Empowerment",
    "Child Welfare",
    "Elderly Care",
    "Disaster Relief",
    "Animal Welfare",
    "Arts & Culture",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 2000);
  };

  const toggleFocusArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {step === 3 ? (
            /* Success State */
            <div className="text-center py-16 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-sage" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Registration Submitted!
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Thank you for registering your organization. Our team will review your application
                and get back to you within 2-3 business days.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="hero" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-2xl gradient-navy flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Register Your NGO
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Join our network of verified organizations and connect with passionate donors and volunteers.
                </p>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-center gap-4 mb-12">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step >= s
                          ? "gradient-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > s ? <Check className="w-5 h-5" /> : s}
                    </div>
                    {s < 2 && <div className={`w-20 h-1 rounded ${step > s ? "gradient-primary" : "bg-muted"}`} />}
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 shadow-medium border border-border/50">
                {step === 1 ? (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground mb-6">Organization Details</h2>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="orgName">Organization Name *</Label>
                        <Input
                          id="orgName"
                          placeholder="Your Organization Name"
                          value={formData.orgName}
                          onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number *</Label>
                        <Input
                          id="registrationNumber"
                          placeholder="NGO-XXXXX"
                          value={formData.registrationNumber}
                          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="website"
                            placeholder="https://example.org"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="contact@ngo.org"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address">Address *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="address"
                            placeholder="Street address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          placeholder="Country"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="button" variant="hero" onClick={() => setStep(2)}>
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground mb-6">Mission & Focus</h2>

                    <div className="space-y-2">
                      <Label htmlFor="description">Organization Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your organization..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mission">Mission Statement *</Label>
                      <Textarea
                        id="mission"
                        placeholder="What is your organization's mission?"
                        value={formData.mission}
                        onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Focus Areas *</Label>
                      <div className="flex flex-wrap gap-2">
                        {focusAreaOptions.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleFocusArea(area)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              formData.focusAreas.includes(area)
                                ? "gradient-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person Name *</Label>
                        <Input
                          id="contactName"
                          placeholder="John Doe"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactRole">Role/Position *</Label>
                        <Input
                          id="contactRole"
                          placeholder="Executive Director"
                          value={formData.contactRole}
                          onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Documents</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">
                          Drag and drop your registration certificate, or click to browse
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button type="submit" variant="hero" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NGORegisterPage;
