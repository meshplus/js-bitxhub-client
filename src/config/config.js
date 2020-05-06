// Nodes
let hosts = ['10.1.16.48'];
let ports = [9099];

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