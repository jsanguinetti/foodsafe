export default class PromisifiedWeb3 {
  constructor(web3) {
    this.web3 = web3;
  }
  estimateGas(params) {
    const estimateGasAsync = (resolve, reject) => {
      this.web3.eth.estimateGas(
                params,
                (error, estimatedGas) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(estimatedGas);
                  }
                }
            );
    };
    return new Promise(estimateGasAsync);
  }
}