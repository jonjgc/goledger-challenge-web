import { useQuery } from '@tanstack/react-query';
import { getWatchlists } from '@/services/watchlist';

export function useWatchlists() {
  return useQuery({
    queryKey: ['watchlists'],
    queryFn: getWatchlists,
  });
}