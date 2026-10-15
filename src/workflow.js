'use strict';

const {getCommand} = require('./commands');
const {languageLabel, parseTranslationQuery} = require('./languages');
const {transform} = require('./naming');
const google = require('./translators/google');
const presenter = require('./presenter');

async function createItems(commandName, query, dependencies) {
    const command = getCommand(commandName);
    if (!command) {
        return [presenter.messageItem('未知命令', `不支持 ${commandName}`)];
    }

    if (!query) {
        return [presenter.messageItem(
            command.mode === 'translation' ? command.label : `${command.label}命名`,
            command.mode === 'translation'
                ? '输入内容直接翻译；可用 >en、>de、>zh 指定结果语言'
                : '请输入中文或英文，例如：用户信息'
        )];
    }

    const translator = dependencies && dependencies.translate
        ? dependencies.translate
        : google.translate;

    if (command.mode === 'translation') {
        return createTranslationItems(query, translator);
    }

    return createNamingItems(query, command, translator);
}

async function createNamingItems(query, command, translator) {
    const result = await translator(query, {from: 'auto', to: 'en'});
    const translations = Array.isArray(result.translations) ? result.translations : [];

    const seen = new Set();
    return translations.reduce((items, translation) => {
        const value = transform(translation, command.transform);
        if (value && !seen.has(value)) {
            seen.add(value);
            items.push(presenter.resultItem(value, translation, command));
        }
        return items;
    }, []);
}

async function createTranslationItems(query, translator) {
    const request = parseTranslationQuery(query);
    if (!request.text) {
        return [presenter.messageItem(
            `翻译为${languageLabel(request.target)}`,
            `请在 >${request.target} 后输入需要翻译的内容`
        )];
    }

    const result = await translator(request.text, {from: 'auto', to: request.target});
    const translations = Array.isArray(result.translations) ? result.translations : [];
    const seen = new Set();

    return translations.reduce((items, translation) => {
        const value = String(translation || '').trim();
        if (value && !seen.has(value)) {
            seen.add(value);
            items.push(presenter.translationItem(
                value,
                result.detectedLanguage,
                request.target,
                languageLabel
            ));
        }
        return items;
    }, []);
}

async function run(commandName, query, dependencies) {
    try {
        return await createItems(commandName, query, dependencies);
    } catch (error) {
        return [presenter.errorItem(error)];
    }
}

module.exports = {createItems, createNamingItems, createTranslationItems, run};
