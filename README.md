# Docker Init [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/docker-init.svg?style=flat
[NPMURL]: https://npmjs.org/package/docker-init "npm"
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[BuildStatusURL]: https://github.com/coderaiser/node-docker-init/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/node-docker-init/workflows/Node%20CI/badge.svg
[CoverageURL]: https://coveralls.io/github/coderaiser/node-docker-init?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/node-docker-init/badge.svg?branch=master&service=github

Init [docker](https://docker.com "Docker") with [dockerode](https://github.com/apocas/dockerode "Dockerode") parameters.

## Install

```
npm i docker-init --save
```

## How to use?

`docker init` takes options with 3 properties:

- **socketPath** - `/var/run/docker.sock` by default
- **host** - host of docker machine, could be used `$DOCKER_HOST` or any host in format `<ip>:<port>`, e.g. `192.168.99.100:2376`.
- **certPath** - path to read certificates (`key.pem`, `ca.pem`, `cert.pem`) from, could be used `$DOCKER_CERT_PATH`.

```js
const dockerInit = require('docker-init');

// on local linux
docker = dockerInit();
// on mac os or windows, with default docker install
docker = dockerInit({
    host: process.env.DOCKER_HOST,
    certPath: process.env.DOCKER_CERT_PATH,
});

// now you can use Dockerode API
```

## License

MIT
