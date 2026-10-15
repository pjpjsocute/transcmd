'use strict';

const ALIASES = Object.freeze({
    zh: 'zh-CN',
    cn: 'zh-CN',
    '中文': 'zh-CN',
    '中': 'zh-CN',
    en: 'en',
    '英文': 'en',
    '英': 'en',
    de: 'de',
    '德文': 'de',
    '德': 'de',
    ja: 'ja',
    jp: 'ja',
    '日文': 'ja',
    '日': 'ja',
    ko: 'ko',
    kr: 'ko',
    '韩文': 'ko',
    '韩': 'ko',
    fr: 'fr',
    '法文': 'fr',
    '法': 'fr',
    es: 'es',
    '西班牙文': 'es',
    it: 'it',
    '意大利文': 'it',
    ru: 'ru',
    '俄文': 'ru'
});

const LABELS = Object.freeze({
    'zh-CN': '中文',
    en: '英文',
    de: '德文',
    ja: '日文',
    ko: '韩文',
    fr: '法文',
    es: '西班牙文',
    it: '意大利文',
    ru: '俄文'
});

function normalizeLanguage(value) {
    const input = String(value || '').trim();
    const alias = ALIASES[input.toLowerCase()] || ALIASES[input];
    if (alias) {
        return alias;
    }
    if (!/^[a-z]{2,3}(?:-[a-z]{2})?$/i.test(input)) {
        throw new Error(`无法识别目标语言：${input}`);
    }
    const parts = input.split('-');
    return parts.length === 1
        ? parts[0].toLowerCase()
        : `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
}

function languageLabel(code) {
    return LABELS[code] || code || '自动识别';
}

function defaultTarget(text) {
    // Japanese kana and Korean Hangul should translate to Chinese. Han-only
    // input is treated as Chinese and translates to English by default.
    if (/[\u3040-\u30ff\uac00-\ud7af]/u.test(text)) {
        return 'zh-CN';
    }
    return /[\u3400-\u9fff]/u.test(text) ? 'en' : 'zh-CN';
}

function parseTranslationQuery(query) {
    const input = String(query || '').trim();
    if (!input.startsWith('>')) {
        return {text: input, target: defaultTarget(input), explicitTarget: false};
    }

    const match = input.match(/^>(\S+)(?:\s+([\s\S]*))?$/);
    if (!match) {
        throw new Error('目标语言格式不正确');
    }

    return {
        text: (match[2] || '').trim(),
        target: normalizeLanguage(match[1]),
        explicitTarget: true
    };
}

module.exports = {
    defaultTarget,
    languageLabel,
    normalizeLanguage,
    parseTranslationQuery
};
