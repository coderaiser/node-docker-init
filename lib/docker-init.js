'use strict';

let fs          = require('fs');
let path        = require('path');
let url         = require('url');
let Docker      = require('dockerode');
let untildify   = require('untildify');

module.exports = (config) => {
   return new Docker(parse(config));
};

module.exports.parse = parse;
module.exports.readFileSync = readFileSync;
module.exports.parseDockerHost = parseDockerHost;

function parse(config) {
    config = config || {};
    
    let options;
    let socketPath  = config.socketPath;
    let host        = config.host;
    let certPath    = config.certPath;
    
    if (!socketPath && !host)
        return;
    else if (socketPath)
        return {
            socketPath: socketPath
        };
    
    options = parseDockerHost(host);
    
    if (certPath) {
        options.ca      = readFileSync(certPath, 'ca');
        options.key     = readFileSync(certPath, 'key');
        options.cert    = readFileSync(certPath, 'cert');
    }
    
    return options;
}

function readFileSync(certPath, name) {
    readFileSyncCheck(certPath, name);
    
    let data;
    
    certPath    = untildify(certPath);
    name        = path.join(certPath, name);
    data        = fs.readFileSync(`${name}.pem`, 'utf8');
    
    return data;
}

function parseDockerHost(host) {
    let result;
    
    if (host) {
        host = 'http://' + host.replace('tcp://', '');
        
        let data = url.parse(host);
        
        result = {
            host: data.hostname,
            port: Number(data.port)
        };
    }
    
    return result;
}

function readFileSyncCheck(certPath, name) {
    if (typeof certPath !== 'string')
        throw Error('certPath should be string!');
    
    if (typeof name !== 'string')
        throw Error('name should be string!');
    
}
