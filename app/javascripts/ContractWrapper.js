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
  at(contractAddress) {
    const atAsync = (resolve, reject) => {
      this.contract.at(contractAddress, (error, deployedContract) => {
        if (error)
          reject(error);
        else
          resolve(new ContractWrapper(deployedContract));
      });
    };
    return new Promise(atAsync);
  }
  addNewLocation(locationId, locationName, encryptedSecret) {
    const addNewLocationAsync = (resolve, reject) => {
      this.contract.addNewLocation(locationId, locationName, encryptedSecret, (error, returnValue) => {
        if (error)
          reject(error);
        else
          resolve(returnValue);
      });
    };
    return new Promise(addNewLocationAsync);
  }
  getTrailCount() {
    const getTrailCountAsync = (resolve, reject) => {
      this.contract.getTrailCount((error, trailCount) => {
        if (error)
          reject(error);
        else
          resolve(trailCount);
      });
    };
    return new Promise(getTrailCountAsync);
  }
  getLocation(locationIndex) {
    const getLocationAsync = (resolve, reject) => {
      this.contract.getLocation(locationIndex, (error, returnValues) =>{
        if (error)
          reject(error);
        else
          resolve(returnValues);
      });
    };
    return new Promise(getLocationAsync);
  }
}