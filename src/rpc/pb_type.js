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
function pbUInt32(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.U32);
    param.setValue(Buffer.from(i.toString()));
    return param;
}
function pbUInt64(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.U64);
    param.setValue(Buffer.from(i.toString()));
    return param;
}
function pbFloat32(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.F32);
    param.setValue(Buffer.from(i.toString()));
    return param;
}
function pbFloat64(i) {
    let param = new pb.Arg();
    param.setType(pb.Arg.Type.F64);
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
    pbUInt32,
    pbUInt64,
    pbFloat32,
    pbFloat64,
    pbString,
    pbBytes
};