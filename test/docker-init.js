import {test} from 'supertape';
import {dockerInit} from '../lib/docker-init.js';

test('docker-init: return', (t) => {
    t.ok(dockerInit(), 'should return object');
    t.end();
});

test('docker-init: return: host', (t) => {
    const {host} = dockerInit().modem;

    t.equal(host, 'localhost');
    t.end();
});
