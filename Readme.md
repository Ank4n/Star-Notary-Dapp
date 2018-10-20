## Decentralized Star Notary Project

#### Built with

- Solidity
- Javascript
- Ethereum
- Web3
- Open-Zeppelin
- Truffle
- Rinkeby Test Network
- Infura

#### Setup

- Run ganache cli `ganache-cli`
- `cd smart_contracts`
- `truffle test`
- `truffle deploy`
- `truffle console`
- `StarNotary.deployed().then(function(instance){app = instance;})`
- `app.createStar("awesome star!", "a star story", "032.155", "121.874", "245.978");`

###### To use front end interface
- Run ganache cli with mneumonic `ganache-cli -m 'genre thing flame snap later custom believe wife convince odor champion pet'`
- Open /index.html in your browser

###### To use contract deployed on infura
- `cd smart_contracts`
- `truffle console --network rinkeby`
