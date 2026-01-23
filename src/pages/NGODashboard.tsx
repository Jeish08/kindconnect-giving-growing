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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useMyNGO } from "@/hooks/useNGO";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Heart,
  HandHeart,
  Plus,
  Users,
  IndianRupee,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react";

const NGODashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: myNGO, isLoading: ngoLoading } = useMyNGO(user?.id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [causeDialog, setCauseDialog] = useState(false);
  const [opportunityDialog, setOpportunityDialog] = useState(false);
  const [causeForm, setCauseForm] = useState({
    title: "",
    description: "",
    target_amount: "",
    image_url: "",
  });
  const [opportunityForm, setOpportunityForm] = useState({
    title: "",
    description: "",
    location: "",
    slots_available: "10",
    skills_required: "",
  });

  // Fetch causes for this NGO
  const { data: causes, isLoading: causesLoading } = useQuery({
    queryKey: ["ngo_causes", myNGO?.id],
    queryFn: async () => {
      if (!myNGO?.id) return [];
      const { data, error } = await supabase
        .from("causes")
        .select("*")
        .eq("ngo_id", myNGO.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!myNGO?.id,
  });

  // Fetch opportunities for this NGO
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["ngo_opportunities", myNGO?.id],
    queryFn: async () => {
      if (!myNGO?.id) return [];
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("ngo_id", myNGO.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!myNGO?.id,
  });

  // Fetch donations for this NGO
  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["ngo_donations", myNGO?.id],
    queryFn: async () => {
      if (!myNGO?.id) return [];
      const { data, error } = await supabase
        .from("donations")
        .select(`*, cause:causes(title)`)
        .eq("ngo_id", myNGO.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!myNGO?.id,
  });

  // Fetch volunteer applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["ngo_applications", myNGO?.id],
    queryFn: async () => {
      if (!myNGO?.id) return [];
      const opportunityIds = opportunities?.map((o) => o.id) || [];
      if (opportunityIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select(`
          *,
          opportunity:opportunities(title),
          volunteer:profiles!volunteer_applications_volunteer_id_fkey(full_name, email)
        `)
        .in("opportunity_id", opportunityIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!myNGO?.id && !!opportunities,
  });

  // Create cause mutation
  const createCause = useMutation({
    mutationFn: async (data: typeof causeForm) => {
      const { error } = await supabase.from("causes").insert({
        ngo_id: myNGO?.id,
        title: data.title,
        description: data.description,
        target_amount: Number(data.target_amount) || 0,
        image_url: data.image_url || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Cause created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["ngo_causes"] });
      setCauseDialog(false);
      setCauseForm({ title: "", description: "", target_amount: "", image_url: "" });
    },
    onError: (error) => {
      toast({ title: "Error creating cause", description: error.message, variant: "destructive" });
    },
  });

  // Create opportunity mutation
  const createOpportunity = useMutation({
    mutationFn: async (data: typeof opportunityForm) => {
      const { error } = await supabase.from("opportunities").insert({
        ngo_id: myNGO?.id,
        title: data.title,
        description: data.description,
        location: data.location,
        slots_available: Number(data.slots_available) || 10,
        skills_required: data.skills_required.split(",").map((s) => s.trim()).filter(Boolean),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Opportunity created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["ngo_opportunities"] });
      setOpportunityDialog(false);
      setOpportunityForm({ title: "", description: "", location: "", slots_available: "10", skills_required: "" });
    },
    onError: (error) => {
      toast({ title: "Error creating opportunity", description: error.message, variant: "destructive" });
    },
  });

  // Update application status
  const updateApplication = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "accepted" | "rejected" }) => {
      const { error } = await supabase
        .from("volunteer_applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Application updated!" });
      queryClient.invalidateQueries({ queryKey: ["ngo_applications"] });
    },
  });

  if (authLoading || ngoLoading) {
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

  if (!myNGO) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">No NGO Found</h1>
            <p className="text-muted-foreground mb-4">
              You haven't registered an NGO yet.
            </p>
            <Button onClick={() => navigate("/ngo-register")}>Register Your NGO</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (myNGO.status === "pending") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">NGO Pending Approval</h1>
            <p className="text-muted-foreground mb-4">
              Your NGO "{myNGO.name}" is awaiting admin approval. You'll be able to access the dashboard once approved.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (myNGO.status === "rejected") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">NGO Application Rejected</h1>
            <p className="text-muted-foreground mb-4">
              Unfortunately, your NGO application was not approved. Please contact support for more information.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">{myNGO.name}</h1>
                <p className="text-muted-foreground">NGO Dashboard</p>
              </div>
            </div>
            <Badge className="bg-green-500">Verified</Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{causes?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Active Causes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">₹{(totalDonations / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Total Raised</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <HandHeart className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{opportunities?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{applications?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="causes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="causes">Causes</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            {/* Causes Tab */}
            <TabsContent value="causes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Causes</CardTitle>
                  <Dialog open={causeDialog} onOpenChange={setCauseDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Add Cause
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Cause</DialogTitle>
                        <DialogDescription>Add a new fundraising cause</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={causeForm.title}
                            onChange={(e) => setCauseForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="E.g., Education for Rural Children"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={causeForm.description}
                            onChange={(e) => setCauseForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Describe the cause..."
                          />
                        </div>
                        <div>
                          <Label>Target Amount (₹)</Label>
                          <Input
                            type="number"
                            value={causeForm.target_amount}
                            onChange={(e) => setCauseForm((p) => ({ ...p, target_amount: e.target.value }))}
                            placeholder="100000"
                          />
                        </div>
                        <div>
                          <Label>Image URL (optional)</Label>
                          <Input
                            value={causeForm.image_url}
                            onChange={(e) => setCauseForm((p) => ({ ...p, image_url: e.target.value }))}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCauseDialog(false)}>Cancel</Button>
                        <Button
                          onClick={() => createCause.mutate(causeForm)}
                          disabled={createCause.isPending || !causeForm.title}
                        >
                          {createCause.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {causesLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : causes?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No causes yet. Create your first cause!</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Raised</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {causes?.map((cause) => (
                          <TableRow key={cause.id}>
                            <TableCell className="font-medium">{cause.title}</TableCell>
                            <TableCell>₹{Number(cause.target_amount).toLocaleString()}</TableCell>
                            <TableCell>₹{Number(cause.raised_amount).toLocaleString()}</TableCell>
                            <TableCell>
                              {Math.round((Number(cause.raised_amount) / Number(cause.target_amount)) * 100)}%
                            </TableCell>
                            <TableCell>
                              <Badge variant={cause.is_active ? "default" : "secondary"}>
                                {cause.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Volunteer Opportunities</CardTitle>
                  <Dialog open={opportunityDialog} onOpenChange={setOpportunityDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Add Opportunity
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Volunteer Opportunity</DialogTitle>
                        <DialogDescription>Add a new volunteer position</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={opportunityForm.title}
                            onChange={(e) => setOpportunityForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="E.g., Teaching Assistant"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={opportunityForm.description}
                            onChange={(e) => setOpportunityForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Describe the opportunity..."
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={opportunityForm.location}
                            onChange={(e) => setOpportunityForm((p) => ({ ...p, location: e.target.value }))}
                            placeholder="Mumbai, Virtual, etc."
                          />
                        </div>
                        <div>
                          <Label>Slots Available</Label>
                          <Input
                            type="number"
                            value={opportunityForm.slots_available}
                            onChange={(e) => setOpportunityForm((p) => ({ ...p, slots_available: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Skills Required (comma-separated)</Label>
                          <Input
                            value={opportunityForm.skills_required}
                            onChange={(e) => setOpportunityForm((p) => ({ ...p, skills_required: e.target.value }))}
                            placeholder="Teaching, Communication, etc."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpportunityDialog(false)}>Cancel</Button>
                        <Button
                          onClick={() => createOpportunity.mutate(opportunityForm)}
                          disabled={createOpportunity.isPending || !opportunityForm.title}
                        >
                          {createOpportunity.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {opportunitiesLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : opportunities?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No opportunities yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Slots</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {opportunities?.map((opp) => (
                          <TableRow key={opp.id}>
                            <TableCell className="font-medium">{opp.title}</TableCell>
                            <TableCell>{opp.location}</TableCell>
                            <TableCell>{opp.slots_available}</TableCell>
                            <TableCell>
                              <Badge variant={opp.is_active ? "default" : "secondary"}>
                                {opp.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  {donationsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : donations?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No donations yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Donor</TableHead>
                          <TableHead>Cause</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations?.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell>
                              {donation.is_anonymous ? "Anonymous" : donation.donor_name || donation.donor_email}
                            </TableCell>
                            <TableCell>{donation.cause?.title || "General"}</TableCell>
                            <TableCell className="font-medium">₹{Number(donation.amount).toLocaleString()}</TableCell>
                            <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : applications?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No applications yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Volunteer</TableHead>
                          <TableHead>Opportunity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications?.map((app: any) => (
                          <TableRow key={app.id}>
                            <TableCell>{app.volunteer?.full_name || app.volunteer?.email}</TableCell>
                            <TableCell>{app.opportunity?.title}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  app.status === "accepted"
                                    ? "default"
                                    : app.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              {app.status === "pending" && (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => updateApplication.mutate({ id: app.id, status: "accepted" })}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600"
                                    onClick={() => updateApplication.mutate({ id: app.id, status: "rejected" })}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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

export default NGODashboard;
