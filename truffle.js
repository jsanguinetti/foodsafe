// Allows us to use ES6 in our migrations and tests.
require('babel-register');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    production: {
      host: 'bclvuliac.eastus.cloudapp.azure.com',
      port: 8545,
      network_id: '*'
    }
  }
};
