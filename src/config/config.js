// Nodes
let hosts = ['172.16.13.121'];
let ports = [9101];

function getHosts() {
    return hosts;
}
function setHosts(host) {
    hosts = host;
}
function getPorts() {
    return ports;
}
function setPorts(port) {
    ports = port;
}

module.exports = {
    getHosts,
    setHosts,
    getPorts,
    setPorts,
};