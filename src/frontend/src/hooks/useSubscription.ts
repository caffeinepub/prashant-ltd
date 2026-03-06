import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

const ADMIN_PRINCIPAL =
  "pq252-35nsf-tlcgc-gcpez-tf4cu-xqnkh-5ey7j-nx6fy-xs63o-e4dab-rae";

export interface SubscriptionStatus {
  isAdmin: boolean;
  isPaid: boolean;
  isLoading: boolean;
  canAccess: boolean;
}

export function useSubscription(): SubscriptionStatus {
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const principalId = identity?.getPrincipal().toString() ?? "";
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const isAdmin = isLoggedIn && principalId === ADMIN_PRINCIPAL;

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", principalId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserStats();
    },
    enabled: !!actor && !isFetching && isLoggedIn && !isAdmin,
    staleTime: 30_000,
  });

  const isPaid = isLoggedIn ? (userStats?.accountStatus ?? false) : false;

  const isLoading = isLoggedIn && !isAdmin && (isFetching || statsLoading);
  const canAccess = isAdmin || isPaid;

  return {
    isAdmin,
    isPaid,
    isLoading,
    canAccess,
  };
}
