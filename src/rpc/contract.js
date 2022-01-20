const pb = require("./transaction_pb");
const Transaction = require("../transaction/index");
const utils = require("web3-utils");
const sha256 = require("js-sha256");
const keccak256 = require("keccak256");
const hexToArrayBuffer = require('hex-to-array-buffer');

async function deployContract(contract) {
  const cli = this;

  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(pb.TransactionData.VMType.XVM);
  td.setPayload(contract);

  let tx = new Transaction();
  tx.tx.setFrom("0x" + this.address);
  tx.tx.setTo("0x0000000000000000000000000000000000000000");
  tx.tx.setPayload(td.serializeBinary());
  nonce = await cli.GetPendingNonce();
  tx.tx.setNonce(nonce);
  await tx.sign(cli.privateKey);
  let transaction = tx.tx.toObject();
  delete transaction.transactionHash;

  let receipt = await cli.SendTransactionWithReceipt(transaction);
  if (receipt.ret) {
    let buffer = Buffer.from(receipt.ret, "base64");
    return utils.toChecksumAddress(utils.bytesToHex(buffer));
  }
  return "";
}

async function getDeployTx(contract, nonce) {
  const cli = this;

  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(pb.TransactionData.VMType.XVM);
  td.setPayload(contract);

  let tx = new Transaction();
  tx.tx.setFrom(new Uint8Array(hexToArrayBuffer(this.address)));
  tx.tx.setTo(new Uint8Array(hexToArrayBuffer("0000000000000000000000000000000000000000")));
  tx.tx.setPayload(td.serializeBinary());
  tx.tx.setNonce(nonce);
  await tx.byteSign(cli.privateKey);
  let transaction = tx.tx.toObject();
  delete transaction.transactionHash;

  return Buffer.from(tx.tx.serializeBinary()).toString("base64");
}

async function deployMetaContract(tx, signature) {
  const cli = this;

  let metaTx = tx;
  metaTx.setSignature(fromHexString(signature.slice(2)));
  metaTx.setTyp(1);
  let transaction = metaTx.toObject();
  delete transaction.transactionHash;

  let receipt = await cli.SendTransactionWithReceipt(transaction);
  if (receipt.ret) {
    let buffer = Buffer.from(receipt.ret, "base64");
    return utils.toChecksumAddress(utils.bytesToHex(buffer));
  }
  return "";
}

async function invokeMetaContract(tx, signature) {
  const cli = this;

  let metaTx = tx;
  metaTx.setSignature(fromHexString(signature.slice(2)));
  metaTx.setTyp(1);
  let transaction = metaTx.toObject();
  delete transaction.transactionHash;

  let receipt = await cli.SendTransactionWithReceipt(transaction);
  if (receipt.ret) {
    let buffer = Buffer.from(receipt.ret, "base64");
    return buffer.toString();
  }
  return "";
}

async function invokeContract(vmType, address, method, nonce, ...args) {
  const cli = this;

  let ip = new pb.InvokePayload();
  ip.setMethod(method);
  ip.setArgsList(args);

  let payload = ip.serializeBinary();
  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(vmType);
  td.setPayload(payload);

  let tx = new Transaction();
  tx.tx.setFrom("0x" + this.address);
  tx.tx.setTo("0x" + address);
  tx.tx.setPayload(td.serializeBinary());
  nonce = await cli.GetPendingNonce();
  tx.tx.setNonce(nonce);
  await tx.sign(cli.privateKey);
  let transaction = tx.tx.toObject();
  delete transaction.transactionHash;

  let receipt = await cli.SendTransactionWithReceipt(transaction);
  if (receipt.ret) {
    let buffer = Buffer.from(receipt.ret, "base64");
    return buffer.toString();
  }
  return "";
}

async function getInvokeTx(vmType, address, method, nonce, ...args) {
  const cli = this;

  let ip = new pb.InvokePayload();
  ip.setMethod(method);
  ip.setArgsList(args);

  let payload = ip.serializeBinary();
  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(vmType);
  td.setPayload(payload);

  let tx = new Transaction();
  tx.tx.setFrom(new Uint8Array(hexToArrayBuffer(this.address)));
  tx.tx.setTo(new Uint8Array(hexToArrayBuffer(address)));
  tx.tx.setPayload(td.serializeBinary());
  tx.tx.setNonce(nonce);
  await tx.byteSign(cli.privateKey);
  let transaction = tx.tx.toObject();
  delete transaction.transactionHash;

  return Buffer.from(tx.tx.serializeBinary()).toString("base64");
}

async function getInvokeMetaTx(tx, signature) {
  const cli = this;

  let metaTx = tx;
  let from = new Uint8Array(hexToArrayBuffer(tx.getFrom().slice(2)))
  let to = new Uint8Array(hexToArrayBuffer(tx.getTo().slice(2)))
  metaTx.setFrom(from)
  metaTx.setTo(to)
  metaTx.setSignature(fromHexString(signature.slice(2)));
  metaTx.setTyp(1);
  let transaction = metaTx.toObject();
  delete transaction.transactionHash;

  return Buffer.from(metaTx.serializeBinary()).toString("base64");
}

async function invokeMetaView(tx, signature) {
  const cli = this;

  let metaTx = tx;
  metaTx.setSignature(fromHexString(signature.slice(2)));
  metaTx.setTyp(1);
  let transaction = metaTx.toObject();
  delete transaction.transactionHash;

  let receipt = await cli.SendViewWithReceipt(transaction);
  if (receipt.ret) {
    let buffer = Buffer.from(receipt.ret, "base64");
    return buffer.toString();
  }
  return "";
}

async function invokeView(vmType, address, method, ...args) {
  const cli = this;

  let ip = new pb.InvokePayload();
  ip.setMethod(method);
  ip.setArgsList(args);

  let payload = ip.serializeBinary();
  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(vmType);
  td.setPayload(payload);

  let tx = new Transaction();
  tx.tx.setFrom("0x" + this.address);
  tx.tx.setTo("0x" + address);
  tx.tx.setPayload(td.serializeBinary());
  nonce = await cli.GetPendingNonce();
  tx.tx.setNonce(nonce);
  await tx.sign(cli.privateKey);
  let transaction = tx.tx.toObject();
  delete transaction.transactionHash;

  let receipt = await cli.SendViewWithReceipt(transaction);
  if (receipt.ret) {
    let buffer = Buffer.from(receipt.ret, "base64");
    return buffer.toString();
  }
  return "";
}

async function getHashString(vmType, address, method, ...args) {
  const cli = this;

  let ip = new pb.InvokePayload();
  ip.setMethod(method);
  ip.setArgsList(args);

  let payload = ip.serializeBinary();
  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(vmType);
  td.setPayload(payload);

  let tx = new Transaction();
  tx.tx.setFrom(this.metaAddress);
  tx.tx.setTo("0x" + address);
  tx.tx.setPayload(td.serializeBinary());
  nonce = await cli.GetMetaPendingNonce();
  tx.tx.setNonce(nonce);
  return [tx.tx, keccak256(tx.metaHashString()).toString("hex")];
}

async function getHttpHashString(vmType, address, method, nonce, ...args) {
  const cli = this;

  let ip = new pb.InvokePayload();
  ip.setMethod(method);
  ip.setArgsList(args);

  let payload = ip.serializeBinary();
  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(vmType);
  td.setPayload(payload);

  let tx = new Transaction();
  tx.tx.setFrom(this.metaAddress);
  tx.tx.setTo("0x" + address);
  tx.tx.setPayload(td.serializeBinary());
  tx.tx.setNonce(nonce);
  return [tx.tx, keccak256(tx.metaHashString()).toString("hex")];
}

async function getHttpDeployString(contract, nonce) {
  const cli = this;

  let td = new pb.TransactionData();
  td.setType(pb.TransactionData.Type.INVOKE);
  td.setVmType(pb.TransactionData.VMType.XVM);
  td.setPayload(contract);

  let tx = new Transaction();
  tx.tx.setFrom(this.metaAddress);
  tx.tx.setTo("0x0000000000000000000000000000000000000000");
  tx.tx.setPayload(td.serializeBinary());
  tx.tx.setNonce(nonce);
  return [tx.tx, keccak256(tx.metaHashString()).toString("hex")];
}

// Decode from base64 and Convert from utf8 to utf-16
function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

// Turns Base64-encoded Ascii Data Back to Binary
function atob(str) {
  return Buffer.from(str, "base64").toString("binary");
}

function strToHexCharCode(str) {
  if (str === "") return "";
  var hexCharCode = [];
  hexCharCode.push("0x");
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push(str.charCodeAt(i).toString(16));
  }
  return hexCharCode.join("");
}

function uint8ArrayToString(fileData) {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString;
}

const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

module.exports = {
  deployContract,
  deployMetaContract,
  invokeContract,
  invokeMetaContract,
  invokeView,
  invokeMetaView,
  getHashString,
  getInvokeTx,
  getInvokeMetaTx,
  getDeployTx,
  getHttpHashString,
  getHttpDeployString,
};
