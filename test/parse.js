'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const {test} = require('supertape');
const {tryCatch} = require('try-catch');
const docker = require('..');

test('parse: no args', (t) => {
    t.notOk(docker.parse(), 'should return nothing');
    t.end();
});

test('parse: socketPath', (t) => {
    const config = {
        socketPath: '/var/run/docker.sock',
    };
    
    const result = docker.parse(config);
    
    t.deepEqual(config, result, 'should return object with socketPath');
    t.end();
});

test('parse: certPath error', (t) => {
    const config = {
        certPath: 'hello',
        host: '192.168.99.100:2376',
    };
    
    const [error] = tryCatch(docker.parse, config);
    
    t.equal(error.code, 'ENOENT', 'no entry error');
    t.end();
});

test('parse: certPath no error', (t) => {
    const name = String(Math.random());
    const dir = path.join(os.tmpdir(), name);
    
    const config = {
        certPath: dir,
        host: '192.168.99.100:2376',
    };
    
    fs.mkdirSync(dir);
    
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.writeFileSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    const result = docker.parse(config);
    
    t.deepEqual(Object.keys(result), [
        'host',
        'port',
        'ca',
        'key',
        'cert',
    ], 'results should containtain properties');
    
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.unlinkSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    fs.rmdirSync(dir);
    
    t.end();
});

test('parse: certPath no error: ca', (t) => {
    const name = String(Math.random());
    const dir = path.join(os.tmpdir(), name);
    
    const config = {
        certPath: dir,
        host: '192.168.99.100:2376',
    };
    
    fs.mkdirSync(dir);
    
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.writeFileSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    const result = docker.parse(config);
    
    t.equal(result.ca, 'hello', 'certificates should be read');
    
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.unlinkSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    fs.rmdirSync(dir);
    
    t.end();
});
