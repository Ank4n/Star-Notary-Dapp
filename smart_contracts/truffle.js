var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'genre thing flame snap later custom believe wife convince odor champion pet';

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: "*"
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/88cc87ae12a94d378420d0374bd91ceb')
            },
            network_id: 4,
            gas: 4500000,
            gasPrice: 10000000000,
        }
    }
};