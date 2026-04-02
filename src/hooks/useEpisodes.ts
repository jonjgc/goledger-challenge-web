import { useQuery } from '@tanstack/react-query';
import { getEpisodes } from '@/services/episodes';

export function useEpisodes() {
  return useQuery({
    queryKey: ['episodes'],
    queryFn: getEpisodes,
  });
}