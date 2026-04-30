'use strict';

const path = require('node:path');
const fs = require('node:fs');

const {test, stub} = require('supertape');
const {tryCatch} = require('try-catch');
const docker = require('..');

test('readFileSync: no arguments', (t) => {
    const [error] = tryCatch(docker.readFileSync);
    
    t.equal(error.message, 'certPath should be string!', 'should throw when no certPath');
    t.end();
});

test('readFileSync: no name', (t) => {
    const [error] = tryCatch(docker.readFileSync, 'hello');
    
    t.equal(error.message, 'name should be string!', 'should throw when no name');
    t.end();
});

test('readFileSync: should throw when no file', (t) => {
    const [error] = tryCatch(docker.readFileSync, 'hello', 'world');
    
    t.equal(error.message, `ENOENT: no such file or directory, open 'hello/world.pem'`, 'should throw when no such file');
    t.end();
});

test('readFileSync: should convert path with "~" in certPath', (t) => {
    const name = String(Math.random());
    const [error] = tryCatch(docker.readFileSync, '~/hello', name);
    
    t.notOk(error.message.includes('~'), 'should not contain "~"');
    t.end();
});

test('readFileSync: path.join', (t) => {
    const {join} = path;
    const joinStub = stub();
    
    path.join = joinStub;
    
    tryCatch(docker.readFileSync, 'hello', 'world');
    path.join = join;
    
    t.calledWith(joinStub, ['hello', 'world'], 'path.join should have been called');
    t.end();
});

test('readFileSync: fs.readFileSync', (t) => {
    const {readFileSync} = fs;
    const readFileSyncStub = stub();
    
    fs.readFileSync = readFileSyncStub;
    
    docker.readFileSync('hello', 'world');
    
    fs.readFileSync = readFileSync;
    
    t.calledWith(readFileSyncStub, [
        'hello/world.pem',
        'utf8',
    ], 'fs.readFileSync should have been called');
    t.end();
});
