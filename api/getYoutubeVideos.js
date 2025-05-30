// /api/getYoutubeVideos.js

// Esta é a função que vai rodar no servidor seguro do Vercel
export default async function handler(request, response) {
  // Pegamos a chave de API do "cofre" (Environment Variables)
  // A variável process.env só funciona no lado do servidor!
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_CHANNEL_ID = 'UCzixfPx7Cr1pqm_GM5V3n-A'; // Seu ID de canal

  // Se a chave não estiver configurada, retornamos um erro
  if (!YOUTUBE_API_KEY) {
    return response.status(500).json({ error: 'Chave de API do YouTube não configurada.' });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&type=video`;

  try {
    // O servidor do Vercel faz a chamada para a API do YouTube
    const youtubeResponse = await fetch(url);
    if (!youtubeResponse.ok) {
      // Se o YouTube der erro, repassamos o erro
      throw new Error(`Erro na API do YouTube: ${youtubeResponse.statusText}`);
    }
    const data = await youtubeResponse.json();

    // O servidor envia de volta para o seu site apenas os dados (a lista de vídeos)
    // As chaves secretas nunca saem do servidor!
    return response.status(200).json(data);

  } catch (error) {
    // Em caso de qualquer outro erro, também informamos
    return response.status(500).json({ error: error.message });
  }
}
