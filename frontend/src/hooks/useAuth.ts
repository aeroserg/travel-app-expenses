import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/services/api";

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: () => authApi.getProfile(),
  });

  return { user, isLoading, isError };
}
