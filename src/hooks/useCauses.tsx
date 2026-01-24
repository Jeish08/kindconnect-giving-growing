import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Cause {
  id: string;
  ngo_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  target_amount: number;
  raised_amount: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  category?: string;
  ngo?: {
    name: string;
  };
}

export const useCauses = () => {
  return useQuery({
    queryKey: ["causes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("causes")
        .select(`
          *,
          ngo:ngos(name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Cause[];
    },
  });
};

export const useCause = (id: string) => {
  return useQuery({
    queryKey: ["cause", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("causes")
        .select(`
          *,
          ngo:ngos(name, description)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Cause | null;
    },
    enabled: !!id,
  });
};
