'use strict';

function readQuery(argv) {
    return argv.slice(2).join(' ').trim();
}

module.exports = {readQuery};
