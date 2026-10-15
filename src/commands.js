'use strict';

const COMMANDS = Object.freeze({
    xt: {mode: 'naming', transform: 'camel', label: '小驼峰'},
    dt: {mode: 'naming', transform: 'pascal', label: '大驼峰'},
    xh: {mode: 'naming', transform: 'snake', label: '下划线'},
    cl: {mode: 'naming', transform: 'constant', label: '常量'},
    zh: {mode: 'naming', transform: 'kebab', label: '中划线'},
    tr: {mode: 'translation', label: '快速翻译'}
});

function getCommand(name) {
    return COMMANDS[name] || null;
}

module.exports = {COMMANDS, getCommand};
