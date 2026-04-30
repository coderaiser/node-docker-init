import path from 'node:path';
import fs from 'node:fs';
import {test, stub} from 'supertape';
import {tryCatch} from 'try-catch';
import {readCert} from '../lib/docker-init.js';

test('readFileSync: no arguments', (t) => {
    const [error] = tryCatch(readCert);
    
    t.equal(error.message, 'certPath should be string!', 'should throw when no certPath');
    t.end();
});

test('readFileSync: no name', (t) => {
    const [error] = tryCatch(readCert, 'hello');
    
    t.equal(error.message, 'name should be string!', 'should throw when no name');
    t.end();
});

test('readFileSync: should throw when no file', (t) => {
    const [error] = tryCatch(readCert, 'hello', 'world');
    
    t.equal(error.message, `ENOENT: no such file or directory, open 'hello/world.pem'`, 'should throw when no such file');
    t.end();
});

test('readFileSync: should convert path with "~" in certPath', (t) => {
    const name = String(Math.random());
    const [error] = tryCatch(readCert, '~/hello', name);
    
    t.notOk(error.message.includes('~'), 'should not contain "~"');
    t.end();
});

test('readFileSync: path.join', (t) => {
    const {join} = path;
    const joinStub = stub();
    
    path.join = joinStub;
    
    tryCatch(readCert, 'hello', 'world');
    path.join = join;
    
    t.calledWith(joinStub, ['hello', 'world'], 'path.join should have been called');
    t.end();
});

test('readFileSync: fs.readFileSync', (t) => {
    const {readFileSync} = fs;
    const readFileSyncStub = stub();
    
    fs.readFileSync = readFileSyncStub;
    
    readCert('hello', 'world');
    
    fs.readFileSync = readFileSync;
    
    t.calledWith(readFileSyncStub, [
        'hello/world.pem',
        'utf8',
    ], 'fs.readFileSync should have been called');
    t.end();
});
