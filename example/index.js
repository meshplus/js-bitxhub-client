const {
  test_deployXVMContract,
  test_invokeXVMContract,
  test_invokeBVMContract,
} = require("./contract_test");
const { test_register, test_login, test_deploy } = require("./role_test");
const {
  test_sendTransaction,
  test_sendTransactionWithReceipt,
  test_getTransaction,
} = require("./transaction_test");
const { test_tripledes } = require("./tripledes_test");
const { test_aes } = require("./aes_test");
const { test_java_transaction } = require("./java_transaction_test");

// test_deployXVMContract()
// test_invokeXVMContract()
// test_invokeBVMContract()

// test_register()
test_deploy()
// test_java_transaction();

// test_sendTransaction()
// test_sendTransactionWithReceipt()
// test_getTransaction()

// test_tripledes()
// test_aes()
