import { api } from '@/lib/api';

export interface TvShow {
  "@key": string;
  "@assetType": "tvShows";
  title: string;
  description: string;
  recommendedAge: number;
}

export async function getTvShows(): Promise<TvShow[]> {
  const response = await api.post('/query/search', {
    query: {
      selector: {
        "@assetType": "tvShows"
      }
    }
  });
  
  return response.data.result || [];
}