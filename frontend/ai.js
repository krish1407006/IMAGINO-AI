const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const generatedImage = document.getElementById('generated-image');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');
const placeholder = document.getElementById('placeholder');
const downloadBtn = document.getElementById('download-btn');
const downloadContainer = document.getElementById('download-container');
const resetBtn = document.getElementById('reset-btn');

generatedImage.addEventListener('error', function() {
    showError('Failed to load the generated image.');
    generatedImage.classList.add('hidden');
    placeholder.classList.remove('hidden');
    downloadContainer.classList.add('hidden');
    showLoader(false);
});

const API_URL = location.hostname === '' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:8080/api/v1/generate'
    : '/api/v1/generate';

generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showError('Please enter a prompt to generate an image.');
        return;
    }
    hideError();
    showLoader(true);
    placeholder.classList.add('hidden');
    generatedImage.classList.add('hidden');
    downloadContainer.classList.add('hidden');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            let msg = 'Something went wrong.';
            try { const e = JSON.parse(text); msg = e.error || e.details || msg; } catch {}
            showError(msg);
            generatedImage.classList.add('hidden');
            placeholder.classList.remove('hidden');
            downloadContainer.classList.add('hidden');
            return;
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        generatedImage.src = imageUrl;
        generatedImage.classList.remove('hidden');
        placeholder.classList.add('hidden');
        downloadContainer.classList.remove('hidden');
    } catch (error) {
        showError(`Request failed: ${error.message}`);
        console.error('Error:', error);
        generatedImage.classList.add('hidden');
        placeholder.classList.remove('hidden');
        downloadContainer.classList.add('hidden');
    } finally {
        showLoader(false);
    }
});

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const imageUrl = generatedImage.src;
        if (imageUrl) {
            downloadImage(imageUrl);
        } else {
            console.error('No image URL found');
        }
    });
} else {
    console.error('Download button element not found!');
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        promptInput.value = '';
        generatedImage.src = '';
        generatedImage.classList.add('hidden');
        placeholder.classList.remove('hidden');
        downloadContainer.classList.add('hidden');
        hideError();
    });
}

function downloadImage(imageUrl) {
    // Try fetch-based download first (handles CORS better)
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ai-generated-${Date.now()}.png`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log('Download successful');
        })
        .catch(error => {
            console.error('Fetch-based download failed, trying direct download:', error);
            // Fallback to direct download
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `ai-generated-${Date.now()}.png`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}

window.addEventListener('DOMContentLoaded', function() {
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 1500);
    }
});


function showLoader(isLoading) {
    if (isLoading) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorBox.classList.remove('hidden');
}

function hideError() {
    errorBox.classList.add('hidden');
}