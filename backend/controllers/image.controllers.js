import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const image = async (req, res) => {
    console.log('Received request to generate image via Pollinations');

    const { prompt } = req.body || {};
    if (!prompt || String(prompt).trim() === '') return res.status(400).json({ error: 'Prompt required' });

    // Optional params from client
    let {
        model = 'flux',
        width = 512,
        height = 512,
        seed,
        nologo = false,
        privateImg = false,
        enhance = false,
        safe = false,
    } = req.body || {};


    
    // Normalize numeric values
    width = Number(width) || 512;
    height = Number(height) || 512;

    // Build URL for Pollinations API (gen.pollinations.ai)
    let url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    url += `?model=${encodeURIComponent(model)}&width=${encodeURIComponent(width)}&height=${encodeURIComponent(height)}`;

    // seed: if not provided, generate a random large integer
    if (!seed) {
        seed = Math.floor(Math.random() * 100000000);
    }

    if (seed) url += `&seed=${encodeURIComponent(seed)}`;
    if (nologo) url += `&nologo=true`;
    if (privateImg) url += `&private=true`;
    if (enhance) url += `&enhance=true`;
    if (safe) url += `&safe=true`;

    // Add timestamp to prevent caching
    url += `&timestamp=${Date.now()}`;

    try {
        // Prepare headers, add Authorization if API key is present
        const headers = {
            'User-Agent': 'pollinations-client/1.0',
            Accept: 'image/*'
        };
        const apiKey = process.env.POLLINATIONS_API_KEY || process.env.GOOGLE_API_KEY;
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }
        const resp = await fetch(url, {
            method: 'GET',
            headers
        });

        if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            console.error('Pollinations responded with non-OK:', resp.status, text);
            return res.status(502).json({ error: 'Pollinations API error', status: resp.status, details: text });
        }

        const contentType = (resp.headers.get('content-type') || '').toLowerCase();
        if (!contentType.startsWith('image/')) {
            // If not image, try to return the JSON/text for debugging
            const text = await resp.text().catch(() => '');
            console.error('Pollinations returned non-image content-type:', contentType, text.slice?.(0, 100));
            return res.status(502).json({ error: 'Pollinations did not return an image', contentType, details: text });
        }

        const arrayBuffer = await resp.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mime = contentType.split(';')[0] || 'image/png';
        const dataUrl = `data:${mime};base64,${base64}`;

        return res.status(200).json({ photo: dataUrl });

    } catch (err) {
        console.error('Error fetching Pollinations image:', err);
        return res.status(500).json({ error: 'Failed to generate image', details: String(err) });
    }
};

export { image };
