export const txHelpers = (web3) => {
    return {
        getTransactionReceiptAfterMined(txHash, interval = 500) {
            const transactionReceiptAsync = (resolve, reject) => {
                web3.eth.getTransactionReceipt(
                    txHash,
                    (error, receipt) => {
                        if (error) {
                            reject(error);
                        } else if (receipt == null) {
                            setTimeout(
                                () => transactionReceiptAsync(resolve, reject),
                                interval ? interval : 500);
                        } else {
                            resolve(receipt);
                        }
                    }
                );
            };
            if (Array.isArray(txHash)) {
                return Promise.all(
                    txHash.map(oneTxHash => this.getTransactionReceiptMined(oneTxHash, interval)));
            } else if (typeof txHash === "string") {
                return new Promise(transactionReceiptAsync);
            } else {
                throw new Error("Invalid Type: " + txHash);
            }
        }
    }
};