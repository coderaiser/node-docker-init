'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const docker = require('..');
const test = require('tape');
const tryCatch = require('try-catch');

test('parse: no args', (t) => {
    t.notOk(docker.parse(), 'should return nothing');
    t.end();
});

test('parse: socketPath', (t) => {
    const config = {
        socketPath: '/var/run/docker.sock'
    };
    
    const result = docker.parse(config);
    
    t.deepEqual(config, result, 'should return object with socketPath');
    t.end();
});

test('parse: certPath error', (t) => {
    const fn = () => docker.parse(config);
    const config = {
        certPath: 'hello',
        host: '192.168.99.100:2376'
    };
    
    const error = tryCatch(() => {
        fn();
    });
    t.ok(error, 'should be read error');
    t.equal(error.code, 'ENOENT', 'no entry error');
    
    t.end();
});

test('parse: certPath no error', (t) => {
    const name = String(Math.random());
    const dir = path.join(os.tmpdir(), name);
    const config = {
        certPath: dir,
        host: '192.168.99.100:2376'
    };
    
    fs.mkdir(dir);
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.writeFileSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    const result = docker.parse(config);
   
    t.deepEqual(Object.keys(result), ['host', 'port', 'ca', 'key', 'cert'], 'results should containtain properties');
    t.equal(result.ca, 'hello', 'certificates should be read');
    
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.unlinkSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    fs.rmdirSync(dir);
    
    t.end();
});

