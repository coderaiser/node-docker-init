'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const Docker = require('dockerode');
const untildify = require('untildify');

module.exports = (config) => {
   return new Docker(parse(config));
};

module.exports.parse = parse;
module.exports.readFileSync = readFileSync;
module.exports.parseDockerHost = parseDockerHost;

function parse(config) {
    config = config || {};
    
    const socketPath = config.socketPath;
    const host = config.host;
    const certPath = config.certPath;
    
    if (!socketPath && !host)
        return;
    
    if (socketPath)
        return {
            socketPath
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
    const data = url.parse(host);
    
    return {
        host: data.hostname,
        port: Number(data.port)
    };
}

function readFileSyncCheck(certPath, name) {
    if (typeof certPath !== 'string')
        throw Error('certPath should be string!');
    
    if (typeof name !== 'string')
        throw Error('name should be string!');
}
