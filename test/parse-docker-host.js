'use strict';

const {test} = require('supertape');
const docker = require('..');

test('parseDockerHost: no args', (t) => {
    t.notOk(docker.parseDockerHost(), 'should return nothing');
    t.end();
});

test('parseDockerHost: host format: "<ip>:<port>": host', (t) => {
    const url = 'tcp://192.168.99.100:2376';
    const {host} = docker.parseDockerHost(url);
    
    t.equal(host, '192.168.99.100', 'should get ip');
    t.end();
});

test('parseDockerHost: host format: "<ip>:<port>": port', (t) => {
    const host = 'tcp://192.168.99.100:2376';
    const {port} = docker.parseDockerHost(host);
    
    t.equal(port, 2376, 'should get port');
    t.end();
});
