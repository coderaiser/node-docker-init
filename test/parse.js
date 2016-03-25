'use strict';

let docker      = require('..');
let test        = require('tape');
let tryCatch    = require('try-catch');

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

test('parse: certPath', (t) => {
    let fn = () => docker.parse(config);
    let config = {
        certPath: 'hello',
        host: '192.168.99.100:2376'
    };
    
    let error = tryCatch(() => {
        fn();
    });
    t.ok(error, 'should be read error');
    t.equal(error.code, 'ENOENT', 'no entry error');
    
    t.end();
});

