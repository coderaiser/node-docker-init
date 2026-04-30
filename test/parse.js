import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {test} from 'supertape';
import {tryCatch} from 'try-catch';
import {parse} from '../lib/docker-init.js';

test('parse: no args', (t) => {
    t.notOk(parse(), 'should return nothing');
    t.end();
});

test('parse: socketPath', (t) => {
    const config = {
        socketPath: '/var/run/docker.sock',
    };
    
    const result = parse(config);
    
    t.deepEqual(config, result, 'should return object with socketPath');
    t.end();
});

test('parse: certPath error', (t) => {
    const config = {
        certPath: 'hello',
        host: '192.168.99.100:2376',
    };
    
    const [error] = tryCatch(parse, config);
    
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
    
    const result = parse(config);
    
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
    
    const result = parse(config);
    
    t.equal(result.ca, 'hello', 'certificates should be read');
    
    ['ca', 'key', 'cert'].forEach((name) => {
        fs.unlinkSync(path.join(dir, `${name}.pem`), 'hello');
    });
    
    fs.rmdirSync(dir);
    
    t.end();
});
