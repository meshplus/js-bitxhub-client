const { AES, Client, PbType } = require("../index");
const { Transaction } = require("../index");
const http = require("http");
const pb = require("../src/rpc/transaction_pb");
const fs = require("fs");
const hexToArrayBuffer = require("hex-to-array-buffer");
const utils = require("web3-utils");

async function test_java_transaction() {
  let options = {
    method: "post",
    host: "172.16.13.121",
    port: "8080",
    path: encodeURI("/api/v1/transaction/tx"),
  };
  let tx = new Transaction();

  let key = fs.readFileSync("./testdata/key.json").toString();
  let priv = JSON.parse(key).cipher.data;
  let decrypted = AES.decrypt(priv, "bitxhub");

  let cli = new Client(decrypted);
  console.log(cli);
  let receipt = await cli.GetDeployTx(
    new Uint8Array([1,2,3,4]),
    33
  );
  console.log(receipt);
  console.log("test_login ---", receipt);
  let postData = {
    raw: receipt,
  };
  let res = await doRequest(options, postData);
  console.log(res);
}
function doRequest(options, payload) {
  let data = "";
  return new Promise((resolve, reject) => {
    let req = http.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        data += chunk;
      });
      res.on("end", function () {
        console.log(data);
        resolve(JSON.parse(data));
      });
    });
    if (options.method === "post") {
      req.write(JSON.stringify(payload));
    }
    req.on("error", function (e) {
      reject(e.message);
    });
    req.end();
  });
}

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

function arrayBufferToBase64(array) {
  array = new Uint8Array(array);
  var length = array.byteLength;
  var table = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/",
  ];
  var base64Str = "";
  for (var i = 0; length - i >= 3; i += 3) {
    var num1 = array[i];
    var num2 = array[i + 1];
    var num3 = array[i + 2];
    base64Str +=
      table[num1 >>> 2] +
      table[((num1 & 0b11) << 4) | (num2 >>> 4)] +
      table[((num2 & 0b1111) << 2) | (num3 >>> 6)] +
      table[num3 & 0b111111];
  }
  var lastByte = length - i;
  if (lastByte === 1) {
    var lastNum1 = array[i];
    base64Str += table[lastNum1 >>> 2] + table[(lastNum1 & 0b11) << 4] + "==";
  } else if (lastByte === 2) {
    var lastNum1 = array[i];
    var lastNum2 = array[i + 1];
    base64Str +=
      table[lastNum1 >>> 2] +
      table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)] +
      table[(lastNum2 & 0b1111) << 2] +
      "=";
  }
  return base64Str;
}

const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

module.exports = {
  test_java_transaction,
};
