import { api } from '@/lib/api';

export interface Watchlist {
  "@key": string;
  "@assetType": "watchlist";
  title: string;
  description?: string;
  tvShows?: {
    "@assetType": "tvShows";
    "@key": string;
  }[];
}

export async function getWatchlists(): Promise<Watchlist[]> {
  const response = await api.post('/query/search', {
    query: { selector: { "@assetType": "watchlist" } }
  });
  return response.data.result || [];
}

export async function createWatchlist(data: Omit<Watchlist, '@key' | '@assetType'>) {
  const response = await api.post('/invoke/createAsset', {
    asset: [{ "@assetType": "watchlist", ...data }]
  });
  return response.data;
}

export async function updateWatchlist(data: Watchlist) {
  const response = await api.post('/invoke/updateAsset', {
    update: { ...data }
  });
  return response.data;
}

export async function deleteWatchlist(key: string) {
  const response = await api.post('/invoke/deleteAsset', {
    key: { "@key": key }
  });
  return response.data;
}