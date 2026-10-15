'use strict';

function resultItem(value, translation, command) {
    return {
        uid: `${command.transform}:${value}`,
        title: value,
        subtitle: `Google 翻译：${translation} · 回车复制并粘贴`,
        arg: value,
        valid: true,
        text: {
            copy: value,
            largetype: value
        }
    };
}

function translationItem(value, detectedLanguage, targetLanguage, languageLabel) {
    const source = languageLabel(detectedLanguage);
    const target = languageLabel(targetLanguage);
    return {
        uid: `translation:${targetLanguage}:${value}`,
        title: value,
        subtitle: `${source} → ${target} · Google 翻译 · 回车复制并粘贴`,
        arg: value,
        valid: true,
        text: {
            copy: value,
            largetype: value
        }
    };
}

function messageItem(title, subtitle) {
    return {
        title,
        subtitle,
        valid: false
    };
}

function errorItem(error) {
    const detail = error && error.message ? error.message : String(error);
    return messageItem('翻译失败', `${detail}；请检查网络后重试`);
}

function output(items, stream) {
    const destination = stream || process.stdout;
    destination.write(`${JSON.stringify({items})}\n`);
}

module.exports = {errorItem, messageItem, output, resultItem, translationItem};
