// /api/getContentfulConfig.js

export default async function handler(request, response) {
  // Pegamos as chaves do "cofre" seguro da Vercel
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
  const CONTENTFUL_CONTENT_TYPE_ID = 'configuraesDoSite'; // Seu ID de conteúdo

  if (!SPACE_ID || !ACCESS_TOKEN) {
    return response.status(500).json({ error: 'Credenciais do Contentful não configuradas.' });
  }

  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=${CONTENTFUL_CONTENT_TYPE_ID}&include=1`;

  try {
    const contentfulResponse = await fetch(url);
    if (!contentfulResponse.ok) {
      throw new Error('Erro na API do Contentful');
    }
    const data = await contentfulResponse.json();

    // Envia os dados de configuração de volta para o site
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
