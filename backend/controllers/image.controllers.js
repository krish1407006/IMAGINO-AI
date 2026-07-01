const image = async (req, res) => {
    const { prompt } = req.body || {};
    if (!prompt || String(prompt).trim() === '') return res.status(400).json({ error: 'Prompt required' });

    const {
        model = 'flux',
        width = 1024,
        height = 1024,
        seed,
        nologo = false,
        privateImg = false,
        enhance = false,
        safe = false,
    } = req.body || {};

    let url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    url += `?model=${encodeURIComponent(model)}&width=${width}&height=${height}`;
    url += `&seed=${seed || Math.floor(Math.random() * 100000000)}`;
    if (nologo) url += `&nologo=true`;
    if (privateImg) url += `&private=true`;
    if (enhance) url += `&enhance=true`;
    if (safe) url += `&safe=true`;

    return res.status(200).json({ url });
};

export { image };
