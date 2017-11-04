export default class ContractWrapper {
  constructor(contract) {
    this.contract = contract;
  }
  newContract(params) {
    const newAsync = (resolve, reject) => {
      this.contract.new(
                '',
                params,
                (error, deployedContract) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(deployedContract);
                  }
                }
            );
    };
    return new Promise(newAsync);
  }
}