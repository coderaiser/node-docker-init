'use strict';

const {test} = require('supertape');
const docker = require('..');

test('initDocker: return', (t) => {
    t.ok(docker(), 'should return object');
    t.end();
});
