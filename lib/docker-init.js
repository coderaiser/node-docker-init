import fs from 'node:fs';
import path from 'node:path';
import Docker from 'dockerode';
import untildify from 'untildify';

const isString = (a) => typeof a === 'string';

export const dockerInit = (config) => {
    return new Docker(parse(config));
};

export function parse(config) {
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
        options.ca = readCert(certPath, 'ca');
        options.key = readCert(certPath, 'key');
        options.cert = readCert(certPath, 'cert');
    }
    
    return options;
}

export function readCert(certPath, name) {
    readFileSyncCheck(certPath, name);
    
    certPath = untildify(certPath);
    name = path.join(certPath, name);
    
    return fs.readFileSync(`${name}.pem`, 'utf8');
}

export function parseDockerHost(dockerHost) {
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
