// Vercel Serverless Function: proxy TTS requests to Google Translate
// This replaces the Vite dev proxy in production

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const url = new URL(req.url, `http://${req.headers.host}`);

    // Build Google Translate TTS URL
    const params = new URLSearchParams(url.search);
    const ttsUrl = `https://translate.google.com/translate_tts?${params.toString()}`;

    try {
        const response = await fetch(ttsUrl, {
            headers: {
                'Referer': 'https://translate.google.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            return res.status(response.status).send('TTS request failed');
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(buffer);
    } catch (err) {
        console.error('TTS proxy error:', err);
        res.status(500).send('TTS proxy error');
    }
}
