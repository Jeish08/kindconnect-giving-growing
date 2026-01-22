import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CreateNGOParams {
  name: string;
  description?: string;
  mission?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
}

export const useCreateNGO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateNGOParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Must be logged in to register an NGO");

      const { data, error } = await supabase
        .from("ngos")
        .insert({
          name: params.name,
          description: params.description,
          mission: params.mission,
          website: params.website,
          email: params.email,
          phone: params.phone,
          address: params.address,
          registration_number: params.registrationNumber,
          created_by: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngos"] });
      queryClient.invalidateQueries({ queryKey: ["my-ngo"] });
    },
  });
};

export const useMyNGO = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["my-ngo", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("ngos")
        .select("*")
        .eq("created_by", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useApprovedNGOs = () => {
  return useQuery({
    queryKey: ["approved-ngos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ngos")
        .select("*")
        .eq("status", "approved")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};
