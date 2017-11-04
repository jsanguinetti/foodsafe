// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';

// Import libraries we need.
import { default as Web3} from 'web3';
import TxHelper from './TxHelper.js';
import PromisifiedWeb3 from './PromisifiedWeb3.js';
import ContractWrapper from './ContractWrapper.js';

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var foodSafeABI = JSON.parse(process.env.FOODSAFE_ABI);
var foodSafeCode = process.env.FOODSAFE_CODE;
var foodSafeContract;

window.App = {
  start: function() {
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length == 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      accounts = accs;
      account = accounts[0];
      web3.eth.defaultAccount = account;
      foodSafeContract = web3.eth.contract(foodSafeABI);
    });
  },
  createContract: async () => {
    const pWeb3 = new PromisifiedWeb3(web3);
    const cWrapper = new ContractWrapper(foodSafeContract);
    const txHelper = new TxHelper(web3);
    try {
      const estimatedGas = await pWeb3.estimateGas({data: foodSafeCode});
      const deployedContract = await cWrapper.newContract({
        from: account,
        data: foodSafeCode,
        gas: estimatedGas
      });
      console.log('deployedContract', deployedContract);
      if(deployedContract.transactionHash) {
        const txReceipt = await txHelper.getTransactionReceiptAfterMined(deployedContract.transactionHash);
        console.log('txnReceipt', txReceipt);
        document.getElementById('contractAddress').value = txReceipt.contractAddress;   
      }
    } catch (err) {
      console.log(err);
    }
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }
  App.start();
});
