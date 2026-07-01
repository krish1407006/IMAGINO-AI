import fetch from 'node-fetch';

const image = async (req, res) => {
    const { prompt } = req.body || {};
    if (!prompt || String(prompt).trim() === '') return res.status(400).json({ error: 'Prompt required' });

    const {
        model = 'flux',
        width = 1024,
        height = 1024,
        seed,
    } = req.body || {};

    let url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    url += `?model=${encodeURIComponent(model)}&width=${width}&height=${height}`;
    url += `&seed=${seed || Math.floor(Math.random() * 100000000)}`;
    url += `&nologo=true`;

    try {
        const resp = await fetch(url, {
            headers: { 'User-Agent': 'pollinations-client/1.0' }
        });

        if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            return res.status(502).json({ error: 'Pollinations API error', status: resp.status, details: text.slice(0, 200) });
        }

        const contentType = resp.headers.get('content-type') || 'image/png';
        res.setHeader('Content-Type', contentType);
        resp.body.pipe(res);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to generate image', details: String(err) });
    }
};

export { image };
