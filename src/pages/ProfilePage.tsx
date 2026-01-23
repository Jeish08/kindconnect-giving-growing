import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  Heart, 
  HandHeart, 
  Settings, 
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    bio: "",
  });

  // Fetch profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      if (data) {
        setProfileData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          bio: data.bio || "",
        });
      }
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch donations
  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["my_donations", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          ngo:ngos(name),
          cause:causes(title)
        `)
        .eq("donor_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch volunteer applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["my_applications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select(`
          *,
          opportunity:opportunities(title, location, ngo:ngos(name))
        `)
        .eq("volunteer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const totalDonated = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
  const totalApplications = applications?.length || 0;
  const approvedApplications = applications?.filter((a) => a.status === "accepted").length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500/90 text-white">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile?.full_name || "Your Profile"}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹{totalDonated.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Donated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <HandHeart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalApplications}</p>
                    <p className="text-sm text-muted-foreground">Volunteer Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{approvedApplications}</p>
                    <p className="text-sm text-muted-foreground">Approved Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="donations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="donations" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Donations
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <HandHeart className="w-4 h-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Donations Tab */}
            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>Your Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  {donationsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : donations?.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't made any donations yet</p>
                      <Button onClick={() => navigate("/causes")}>Explore Causes</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {donations?.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{donation.cause?.title || "General Donation"}</p>
                            <p className="text-sm text-muted-foreground">
                              To: {donation.ngo?.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(donation.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              ₹{Number(donation.amount).toLocaleString()}
                            </p>
                            {donation.is_anonymous && (
                              <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Your Volunteer Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : applications?.length === 0 ? (
                    <div className="text-center py-8">
                      <HandHeart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't applied to any opportunities yet</p>
                      <Button onClick={() => navigate("/volunteer")}>Find Opportunities</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications?.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{app.opportunity?.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {app.opportunity?.ngo?.name} • {app.opportunity?.location}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              Applied {new Date(app.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(app.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, full_name: e.target.value }))
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={() => updateProfile.mutate(profileData)}
                    disabled={updateProfile.isPending}
                    className="w-full"
                  >
                    {updateProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
