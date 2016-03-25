'use strict';

let docker      = require('..');
let test        = require('tape');

test('parse: no args', (t) => {
    t.notOk(docker.parse(), 'should return nothing');
    t.end();
});

test('parse: socketPath', (t) => {
    let config = {
        socketPath: '/var/run/docker.sock'
    };
    
    let result = docker.parse(config);
    
    t.deepEqual(config, result, 'should return object with socketPath');
    t.end();
});

