'use strict';

let docker      = require('..');
let test        = require('tape');

test('parseDockerHost: no args', (t) => {
    t.notOk(docker.parseDockerHost(), 'should return nothing');
    t.end();
});

test('parseDockerHost: host format: "<ip>:<port>"', (t) => {
    let host = 'tcp://192.168.99.100:2376';
    let obj = docker.parseDockerHost(host);
    
    t.equal(obj.port, 2376, 'should get port');
    t.equal(obj.host, '192.168.99.100', 'should get ip');
    
    t.end();
});

test('parseDockerHost: host format: "tcp://<ip>:<port>"', (t) => {
    let host = '192.168.99.100:2376';
    let obj = docker.parseDockerHost(host);
    
    t.equal(obj.port, 2376, 'should get port');
    t.equal(obj.host, '192.168.99.100', 'should get ip');
    
    t.end();
});
