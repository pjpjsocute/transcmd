'use strict';

const {readQuery} = require('./input');
const {output} = require('./presenter');
const workflow = require('./workflow');

async function start(commandName, argv) {
    const items = await workflow.run(commandName, readQuery(argv || process.argv));
    output(items);
}

module.exports = {start};
