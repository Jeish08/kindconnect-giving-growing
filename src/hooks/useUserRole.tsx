import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "donor" | "volunteer" | "ngo_admin" | "platform_admin";

export const useUserRoles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user_roles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((r) => r.role as AppRole);
    },
    enabled: !!user?.id,
  });
};

export const useHasRole = (role: AppRole) => {
  const { data: roles, isLoading } = useUserRoles();
  return {
    hasRole: roles?.includes(role) ?? false,
    isLoading,
  };
};

export const useIsAdmin = () => {
  return useHasRole("platform_admin");
};

export const useIsNGOAdmin = () => {
  return useHasRole("ngo_admin");
};
