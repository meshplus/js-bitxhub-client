// Nodes
let hosts = ['172.31.63.120'];
let ports = [9091];

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