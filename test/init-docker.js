import {test} from 'supertape';
import {dockerInit} from '../lib/docker-init.js';

test('initDocker: return', (t) => {
    t.ok(dockerInit(), 'should return object');
    t.end();
});
