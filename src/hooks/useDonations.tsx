import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CreateDonationParams {
  ngoId: string;
  causeId?: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  message?: string;
  isAnonymous?: boolean;
}

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateDonationParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("donations")
        .insert({
          donor_id: user?.id || null,
          ngo_id: params.ngoId,
          cause_id: params.causeId || null,
          amount: params.amount,
          donor_name: params.donorName,
          donor_email: params.donorEmail,
          message: params.message,
          is_anonymous: params.isAnonymous || false,
        })
        .select()
        .single();

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["causes"] });
    },
  });
};

export const useMyDonations = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["donations", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          ngo:ngos(name),
          cause:causes(title)
        `)
        .eq("donor_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
