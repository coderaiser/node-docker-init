'use strict';

let docker      = require('..');
let test        = require('tape');

test('initDocker: return', (t) => {
    t.ok(docker(), 'should return object');
    t.end();
});

