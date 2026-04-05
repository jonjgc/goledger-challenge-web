import { api } from '@/lib/api';

export interface TvShow {
  "@key": string;
  "@assetType": "tvShows";
  title: string;
  description: string;
  recommendedAge: number | string;
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

export async function createTvShow(data: Omit<TvShow, '@key' | '@assetType'>) {
  const response = await api.post('/invoke/createAsset', {
    asset: [
      {
        "@assetType": "tvShows",
        ...data,
      }
    ]
  });
  return response.data;
}

export async function updateTvShow(data: TvShow) {
  const response = await api.post('/invoke/updateAsset', {
    update: {
      ...data,
    }
  });
  return response.data;
}

export async function deleteTvShow(key: string) {
  const response = await api.post('/invoke/deleteAsset', {
    key: {
      "@key": key
    }
  });
  return response.data;
}