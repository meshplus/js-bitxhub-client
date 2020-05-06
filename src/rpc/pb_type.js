const pb = require('./transaction_pb')

function pbInt32(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.I32);
    param.setValue(Buffer.from(i.toString()));
    return param;
}
function pbInt64(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.I64);
    param.setValue(Buffer.from(i.toString()));
    return param;
}
function pbString(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.STRING);
    param.setValue(Buffer.from(i));
    return param;
}
function pbBytes(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.BYTES);
    param.setValue(Buffer.from(i.toString()));
    return param;
}

module.exports = {
    pbInt32,
    pbInt64,
    pbString,
    pbBytes
};