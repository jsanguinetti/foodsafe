// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import TxHelper from './TxHelper.js';

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var foodSafeABI = JSON.parse(process.env.FOODSAFE_ABI);
var foodSafeCode = process.env.FOODSAFE_CODE;
var foodSafeContract;
var helper;

window.App = {
  start: function() {
    var self = this;
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      web3.eth.defaultAccount = account;
      foodSafeContract = web3.eth.contract(foodSafeABI);
    });
  },
  createContract: function() {
    web3.eth.estimateGas(
      {
        data: foodSafeCode
      },
      (err, estimatedGas) => {
        if (err)
          return;
        foodSafeContract.new(
          "",
          {
            from: account,
            data: foodSafeCode,
            gas: estimatedGas
          }, 
          (error, deployedContract) => {
            console.log('error', error);
            console.log('deployedContract', deployedContract);
            if(deployedContract.transactionHash) {
              helper.getTransactionReceiptAfterMined(deployedContract.transactionHash)
                .then((txnReceipt) => {
                  console.log('txnReceipt', txnReceipt);
                  document.getElementById("contractAddress").value = txnReceipt.contractAddress;
                })
                .catch(console.log);
            }
          }
        );
      }
    );
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  helper = new TxHelper(web3);
  App.start();
});
