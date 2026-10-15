'use strict';

const assert = require('assert');
const naming = require('../src/naming');
const languages = require('../src/languages');
const google = require('../src/translators/google');
const workflow = require('../src/workflow');

async function main() {
    assert.strictEqual(naming.transform('User information management', 'camel'), 'userInformationManagement');
    assert.strictEqual(naming.transform('User information management', 'pascal'), 'UserInformationManagement');
    assert.strictEqual(naming.transform('User information management', 'snake'), 'user_information_management');
    assert.strictEqual(naming.transform('User information management', 'constant'), 'USER_INFORMATION_MANAGEMENT');
    assert.strictEqual(naming.transform('User information management', 'kebab'), 'user-information-management');
    assert.strictEqual(naming.transform('response of the API', 'camel'), 'responseApi');
    assert.strictEqual(naming.transform("User's profile", 'pascal'), 'UserProfile');
    assert.strictEqual(naming.transform('XMLHttpRequest', 'snake'), 'xml_http_request');

    assert.deepStrictEqual(
        languages.parseTranslationQuery('用户信息'),
        {text: '用户信息', target: 'en', explicitTarget: false}
    );
    assert.deepStrictEqual(
        languages.parseTranslationQuery('Guten Morgen'),
        {text: 'Guten Morgen', target: 'zh-CN', explicitTarget: false}
    );
    assert.deepStrictEqual(
        languages.parseTranslationQuery('>de 用户信息'),
        {text: '用户信息', target: 'de', explicitTarget: true}
    );
    assert.deepStrictEqual(
        languages.parseTranslationQuery('>中文 hello'),
        {text: 'hello', target: 'zh-CN', explicitTarget: true}
    );

    assert.deepStrictEqual(
        google.parseResponse('[["User information","zh-CN"]]'),
        {translations: ['User information'], detectedLanguage: 'zh-CN'}
    );
    assert.deepStrictEqual(
        google.parseResponse([[["User ", "用户"], ["information", "信息"]], null, 'zh-CN']),
        {translations: ['User information'], detectedLanguage: 'zh-CN'}
    );

    const items = await workflow.createItems('xt', '用户信息', {
        translate: async () => ({translations: ['User information', 'User information']})
    });
    assert.strictEqual(items.length, 1);
    assert.strictEqual(items[0].title, 'userInformation');
    assert.strictEqual(items[0].arg, 'userInformation');
    assert.strictEqual(items[0].valid, true);

    const empty = await workflow.createItems('dt', '', {});
    assert.strictEqual(empty[0].valid, false);

    const failed = await workflow.run('xt', '用户信息', {
        translate: async () => { throw new Error('offline'); }
    });
    assert.strictEqual(failed[0].title, '翻译失败');
    assert.strictEqual(failed[0].valid, false);

    let translationRequest;
    const translated = await workflow.createItems('tr', '>de 用户信息', {
        translate: async (text, options) => {
            translationRequest = {text, options};
            return {translations: ['Benutzerinformationen'], detectedLanguage: 'zh-CN'};
        }
    });
    assert.deepStrictEqual(translationRequest, {
        text: '用户信息',
        options: {from: 'auto', to: 'de'}
    });
    assert.strictEqual(translated[0].title, 'Benutzerinformationen');
    assert.strictEqual(translated[0].arg, 'Benutzerinformationen');
    assert.ok(translated[0].subtitle.includes('中文 → 德文'));

    console.log('All tests passed');
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
