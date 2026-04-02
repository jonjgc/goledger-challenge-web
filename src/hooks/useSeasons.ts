import { useQuery } from '@tanstack/react-query';
import { getSeasons } from '@/services/seasons';

export function useSeasons() {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: getSeasons,
  });
}