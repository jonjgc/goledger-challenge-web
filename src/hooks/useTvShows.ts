import { useQuery } from '@tanstack/react-query';
import { getTvShows } from '@/services/tvShows';

export function useTvShows() {
  return useQuery({
    queryKey: ['tvShows'],
    queryFn: getTvShows,
  });
}