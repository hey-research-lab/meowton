import { useQuery } from "@tanstack/react-query";
import { fetchHoldings, fetchVault } from "@/lib/holdings";

export function useHoldings(address: string | null) {
  return useQuery({
    queryKey: ["holdings", address],
    queryFn: () => fetchHoldings({ data: { address: address as string } }),
    enabled: !!address,
    refetchInterval: 20_000,
    staleTime: 10_000,
  });
}

export function useVault() {
  return useQuery({
    queryKey: ["vault-aapl"],
    queryFn: () => fetchVault(),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}
