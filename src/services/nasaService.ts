import { nasaApi, toApiError } from './api';
import { Apod } from '../types';

/**
 * DEMO_KEY funciona para demonstração (limite de requisições baixo).
 * Para uso intenso, gere uma chave gratuita em https://api.nasa.gov e substitua aqui.
 */
const NASA_API_KEY = 'DEMO_KEY';

/** Astronomy Picture of the Day — toque espacial do app. */
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
