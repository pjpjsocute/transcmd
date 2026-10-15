'use strict';

const STOP_WORDS = new Set(['a', 'an', 'and', 'at', 'of', 'or', 'the', 'to']);

function words(value) {
    const normalized = String(value || '')
        .replace(/[’']s\b/gi, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

    const tokens = normalized.match(/[A-Za-z0-9]+/g) || [];
    const filtered = tokens
        .map(token => token.toLowerCase())
        .filter(token => !STOP_WORDS.has(token));

    // A phrase containing only stop words is still a valid input.
    return filtered.length > 0 ? filtered : tokens.map(token => token.toLowerCase());
}

function capitalize(word) {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
}

const transforms = Object.freeze({
    camel(value) {
        const tokens = words(value);
        return tokens.map((token, index) => index === 0 ? token : capitalize(token)).join('');
    },
    pascal(value) {
        return words(value).map(capitalize).join('');
    },
    snake(value) {
        return words(value).join('_');
    },
    constant(value) {
        return words(value).join('_').toUpperCase();
    },
    kebab(value) {
        return words(value).join('-');
    }
});

function transform(value, style) {
    const transformer = transforms[style];
    if (!transformer) {
        throw new Error(`Unknown naming style: ${style}`);
    }
    return transformer(value);
}

module.exports = {transform, transforms, words};
