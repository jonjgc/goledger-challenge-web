import { api } from '@/lib/api';

export interface Season {
  "@key": string;
  "@assetType": "seasons";
  number: number;
  year: number;
  tvShow: {
    "@assetType": "tvShows";
    "@key": string;
  };
}

export async function getSeasons(): Promise<Season[]> {
  const response = await api.post('/query/search', {
    query: { selector: { "@assetType": "seasons" } }
  });
  return response.data.result || [];
}

export async function createSeason(data: Omit<Season, '@key' | '@assetType'>) {
  const response = await api.post('/invoke/createAsset', {
    asset: [{ "@assetType": "seasons", ...data }]
  });
  return response.data;
}

export async function updateSeason(data: Season) {
  const response = await api.post('/invoke/updateAsset', {
    update: { ...data }
  });
  return response.data;
}

export async function deleteSeason(key: string) {
  const response = await api.post('/invoke/deleteAsset', {
    key: { "@key": key }
  });
  return response.data;
}