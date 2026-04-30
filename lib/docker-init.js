'use strict';

const fs = require('node:fs');
const path = require('node:path');

const Docker = require('dockerode');
const untildify = require('untildify').default;
const isString = (a) => typeof a === 'string';

module.exports = (config) => {
    return new Docker(parse(config));
};

module.exports.parse = parse;
module.exports.readFileSync = readFileSync;
module.exports.parseDockerHost = parseDockerHost;

function parse(config) {
    config = config || {};
    
    const {
        socketPath,
        host,
        certPath,
    } = config;
    
    if (!socketPath && !host)
        return;
    
    if (socketPath)
        return {
            socketPath,
        };
    
    const options = parseDockerHost(host);
    
    if (certPath) {
        options.ca = readFileSync(certPath, 'ca');
        options.key = readFileSync(certPath, 'key');
        options.cert = readFileSync(certPath, 'cert');
    }
    
    return options;
}

function readFileSync(certPath, name) {
    readFileSyncCheck(certPath, name);
    
    certPath = untildify(certPath);
    name = path.join(certPath, name);
    
    return fs.readFileSync(`${name}.pem`, 'utf8');
}

function parseDockerHost(dockerHost) {
    if (!dockerHost)
        return;
    
    const host = 'http://' + dockerHost.replace('tcp://', '');
    const data = new URL(host);
    
    return {
        host: data.hostname,
        port: Number(data.port),
    };
}

function readFileSyncCheck(certPath, name) {
    if (!isString(certPath))
        throw Error('certPath should be string!');
    
    if (!isString(name))
        throw Error('name should be string!');
}
