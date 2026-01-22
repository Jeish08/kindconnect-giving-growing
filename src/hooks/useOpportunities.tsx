import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Opportunity {
  id: string;
  ngo_id: string;
  title: string;
  description: string | null;
  location: string | null;
  skills_required: string[] | null;
  start_datetime: string | null;
  end_datetime: string | null;
  slots_available: number;
  is_active: boolean;
  created_at: string;
  ngo?: {
    name: string;
  };
}

export const useOpportunities = () => {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          ngo:ngos(name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Opportunity[];
    },
  });
};

export const useApplyToOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      opportunityId,
      volunteerId,
      coverLetter,
    }: {
      opportunityId: string;
      volunteerId: string;
      coverLetter?: string;
    }) => {
      const { data, error } = await supabase
        .from("volunteer_applications")
        .insert({
          opportunity_id: opportunityId,
          volunteer_id: volunteerId,
          cover_letter: coverLetter,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer_applications"] });
    },
  });
};

export const useMyApplications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["volunteer_applications", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select(`
          *,
          opportunity:opportunities(title, location, ngo:ngos(name))
        `)
        .eq("volunteer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
