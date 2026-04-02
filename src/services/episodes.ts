import { api } from '@/lib/api';

export interface Episode {
  "@key": string;
  "@assetType": "episodes";
  season: {
    "@assetType": "seasons";
    "@key": string;
  };
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export async function getEpisodes(): Promise<Episode[]> {
  const response = await api.post('/query/search', {
    query: { selector: { "@assetType": "episodes" } }
  });
  return response.data.result || [];
}

export async function createEpisode(data: Omit<Episode, '@key' | '@assetType'>) {
  const response = await api.post('/invoke/createAsset', {
    asset: [{ "@assetType": "episodes", ...data }]
  });
  return response.data;
}

export async function updateEpisode(data: Episode) {
  const response = await api.post('/invoke/updateAsset', {
    update: { ...data }
  });
  return response.data;
}

export async function deleteEpisode(key: string) {
  const response = await api.post('/invoke/deleteAsset', {
    key: { "@key": key }
  });
  return response.data;
}