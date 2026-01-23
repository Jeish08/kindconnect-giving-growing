import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Users,
  Heart,
  HandHeart,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasRole: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedNGO, setSelectedNGO] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: "approve" | "reject";
    ngo: any;
  }>({ open: false, action: "approve", ngo: null });

  // Fetch all NGOs (including pending)
  const { data: ngos, isLoading: ngosLoading } = useQuery({
    queryKey: ["admin_ngos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ngos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Fetch all users
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["admin_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [ngosRes, causesRes, donationsRes, applicationsRes] = await Promise.all([
        supabase.from("ngos").select("id, status"),
        supabase.from("causes").select("id"),
        supabase.from("donations").select("amount"),
        supabase.from("volunteer_applications").select("id"),
      ]);
      
      return {
        totalNGOs: ngosRes.data?.length || 0,
        pendingNGOs: ngosRes.data?.filter((n) => n.status === "pending").length || 0,
        totalCauses: causesRes.data?.length || 0,
        totalDonations: donationsRes.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0,
        totalApplications: applicationsRes.data?.length || 0,
      };
    },
    enabled: isAdmin,
  });

  // Update NGO status mutation
  const updateNGOStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase
        .from("ngos")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast({
        title: `NGO ${status === "approved" ? "approved" : "rejected"} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin_ngos"] });
      queryClient.invalidateQueries({ queryKey: ["admin_stats"] });
      setActionDialog({ open: false, action: "approve", ngo: null });
    },
    onError: (error) => {
      toast({
        title: "Error updating NGO",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (authLoading || roleLoading) {
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage NGOs, users, and platform settings</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalNGOs || 0}</p>
                    <p className="text-xs text-muted-foreground">Total NGOs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.pendingNGOs || 0}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalCauses || 0}</p>
                    <p className="text-xs text-muted-foreground">Causes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">₹{((stats?.totalDonations || 0) / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Donations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <HandHeart className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalApplications || 0}</p>
                    <p className="text-xs text-muted-foreground">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ngos" className="space-y-6">
            <TabsList>
              <TabsTrigger value="ngos">NGO Management</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            {/* NGOs Tab */}
            <TabsContent value="ngos">
              <Card>
                <CardHeader>
                  <CardTitle>NGO Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {ngosLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ngos?.map((ngo) => (
                          <TableRow key={ngo.id}>
                            <TableCell className="font-medium">{ngo.name}</TableCell>
                            <TableCell>{ngo.email}</TableCell>
                            <TableCell>{getStatusBadge(ngo.status)}</TableCell>
                            <TableCell>{new Date(ngo.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedNGO(ngo)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {ngo.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600"
                                      onClick={() =>
                                        setActionDialog({ open: true, action: "approve", ngo })
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600"
                                      onClick={() =>
                                        setActionDialog({ open: true, action: "reject", ngo })
                                      }
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {profilesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profiles?.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell className="font-medium">
                              {profile.full_name || "Not provided"}
                            </TableCell>
                            <TableCell>{profile.email}</TableCell>
                            <TableCell>{profile.phone || "-"}</TableCell>
                            <TableCell>
                              {new Date(profile.created_at).toLocaleDateString()}
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

      {/* NGO Details Dialog */}
      <Dialog open={!!selectedNGO} onOpenChange={() => setSelectedNGO(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNGO?.name}</DialogTitle>
            <DialogDescription>NGO Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedNGO?.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedNGO?.phone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium">{selectedNGO?.website || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-medium">{selectedNGO?.registration_number || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{selectedNGO?.address || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mission</p>
              <p className="font-medium">{selectedNGO?.mission || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{selectedNGO?.description || "-"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? "Approve NGO" : "Reject NGO"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionDialog.action} "{actionDialog.ngo?.name}"?
              {actionDialog.action === "approve"
                ? " This will allow them to create causes and opportunities."
                : " This cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ ...actionDialog, open: false })}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.action === "approve" ? "default" : "destructive"}
              onClick={() =>
                updateNGOStatus.mutate({
                  id: actionDialog.ngo?.id,
                  status: actionDialog.action === "approve" ? "approved" : "rejected",
                })
              }
              disabled={updateNGOStatus.isPending}
            >
              {updateNGOStatus.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {actionDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
