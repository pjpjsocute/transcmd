'use strict';

const https = require('https');

const ENDPOINT = 'https://clients5.google.com/translate_a/t';

function parseResponse(payload) {
    const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
        throw new Error('Google returned an unexpected response');
    }

    // dict-chrome-ex: [["User information", "zh-CN"]]
    if (typeof data[0][0] === 'string') {
        return {
            translations: [data[0][0]],
            detectedLanguage: typeof data[0][1] === 'string' ? data[0][1] : null
        };
    }

    // Also accept the shape returned by translate_a/single.
    const translations = data[0]
        .filter(part => Array.isArray(part) && typeof part[0] === 'string')
        .map(part => part[0]);

    if (translations.length === 0) {
        throw new Error('Google returned no translation');
    }

    return {
        translations: [translations.join('')],
        detectedLanguage: typeof data[2] === 'string' ? data[2] : null
    };
}

function request(url, timeoutMs) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'TransCmd/2.2'
            }
        }, response => {
            let body = '';
            response.setEncoding('utf8');
            response.on('data', chunk => {
                body += chunk;
            });
            response.on('end', () => {
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(new Error(`Google request failed (${response.statusCode})`));
                    return;
                }
                resolve(body);
            });
        });

        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error('Google request timed out'));
        });
        req.on('error', reject);
    });
}

async function translate(text, options) {
    const settings = Object.assign({from: 'auto', to: 'en', timeoutMs: 5000}, options);
    const url = new URL(ENDPOINT);
    url.searchParams.set('client', 'dict-chrome-ex');
    url.searchParams.set('sl', settings.from);
    url.searchParams.set('tl', settings.to);
    url.searchParams.set('q', text);

    return parseResponse(await request(url, settings.timeoutMs));
}

module.exports = {ENDPOINT, parseResponse, translate};
