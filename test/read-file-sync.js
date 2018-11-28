'use strict';

const path = require('path');
const fs = require('fs');

const docker = require('..');
const test = require('tape');
const stub = require('@cloudcmd/stub');
const tryCatch = require('try-catch');

test('readFileSync: no arguments', (t) => {
    t.throws(docker.readFileSync, /certPath should be string!/, 'should throw when no certPath');
    t.end();
});

test('readFileSync: no name', (t) => {
    const fn = () => docker.readFileSync('hello');
    
    t.throws(fn, /name should be string!/, 'should throw when no name');
    t.end();
});

test('readFileSync: should throw when no file', (t) => {
    const fn = () => docker.readFileSync('hello', 'world');
    
    t.throws(fn, /Error: ENOENT: no such file or directory, open 'hello\/world\.pem'/, 'should throw when no such file');
    t.end();
});

test('readFileSync: should convert path with "~" in certPath', (t) => {
    const name = String(Math.random());
    const fn = () => docker.readFileSync('~/hello', name);
    
    const [error] = tryCatch(fn);
    
    t.ok(error, 'should be error');
    t.notOk(error.message.includes('~'), 'should not contain "~"');
    t.end();
});

test('readFileSync: path.join', (t) => {
    const fn = () => docker.readFileSync('hello', 'world');
    const {join} = path;
    const joinStub = stub();
    
    path.join = joinStub;
    
    tryCatch(fn);
    path.join = join;
    
    t.ok(joinStub.calledWith('hello', 'world'), 'path.join should have been called');
    t.end();
});

test('readFileSync: fs.readFileSync', (t) => {
    const {readFileSync} = fs;
    const readFileSyncStub = stub();
    
    fs.readFileSync = readFileSyncStub;
    
    docker.readFileSync('hello', 'world');
    
    fs.readFileSync = readFileSync;
    t.ok(readFileSyncStub.calledWith('hello/world.pem', 'utf8'), 'fs.readFileSync should have been called');
    t.end();
});

