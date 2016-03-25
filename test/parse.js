'use strict';

let fs          = require('fs');
let path        = require('path');
let os          = require('os');

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

test('parse: certPath error', (t) => {
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

test('parse: certPath no error', (t) => {
    let name    = String(Math.random());
    let dir     = path.join(os.tmpdir(), name);
    let config  = {
        certPath: dir,
        host: '192.168.99.100:2376'
    };
    
    fs.mkdir(dir);
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.writeFileSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    let result = docker.parse(config);
   
    t.deepEqual(Object.keys(result), ['host', 'port', 'ca', 'key', 'cert'], 'results should containtain properties');
    t.equal(result.ca, 'hello', 'certificates should be read');

    ['ca', 'key', 'cert'].forEach((name) => {
        fs.unlinkSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    fs.rmdir(dir);
    
    t.end();
});

