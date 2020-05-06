const http   = require('http');
let config = require('../config/config');

// Get Random Integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set Options
async function setOptions(reqMethod, path) {
    let hosts = config.getHosts()
    let ports = config.getPorts()
    return {
        method: reqMethod,
        host: hosts[getRndInteger(0, hosts.length - 1)],
        port: ports[getRndInteger(0, ports.length - 1)],
        path: encodeURI(path),
    }
}

// Do the Request
function doRequest(options, payload) {
    let data = '';
    return new Promise((resolve, reject) => {
        let req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(data));
            });
        });
        if (options.method === 'post') {
            // console.log(JSON.stringify(payload))
            req.write(JSON.stringify(payload));
        }
        req.on('error', function (e) {
            console.log('ERROR?: ' + e.message);
            reject(e.message);
        });
        req.end();
    });
}

module.exports = {
    setOptions,
    doRequest,
};