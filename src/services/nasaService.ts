import { nasaApi, toApiError } from './api';
import { Apod } from '../types';

const NASA_API_KEY = 'DEMO_KEY';

export async function fetchApod(): Promise<Apod> {
  try {
    const { data } = await nasaApi.get('/planetary/apod', {
      params: { api_key: NASA_API_KEY, thumbs: true },
    });
    return {
      title: data.title,
      date: data.date,
      explanation: data.explanation,
      url: data.media_type === 'video' ? data.thumbnail_url ?? data.url : data.url,
      hdurl: data.hdurl,
      mediaType: data.media_type,
      copyright: data.copyright,
    };
  } catch (error) {
    throw toApiError(error, 'carregar a imagem astronômica da NASA');
  }
}
