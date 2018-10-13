/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang.
 */

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        }
    }
};



// module.exports = {
//     networks: {
//         ropsten: {
//             provider: function() {
//                 return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/");
//             },
//             network_id: '1',
//         },
//         test: {
//             provider: function() {
//                 return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/");
//             },
//             network_id: '*',
//         },
//     }
// };
//
