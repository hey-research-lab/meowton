import { useQuery } from "@tanstack/react-query";
import { fetchAapl } from "@/lib/aapl";

export function useAapl() {
  return useQuery({
    queryKey: ["aapl"],
    queryFn: () => fetchAapl(),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}
