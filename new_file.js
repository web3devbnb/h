const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Replace with the address you want to watch

const subscription = web3.eth.subscribe('pendingTransactions', (error, result) => {
    if (!error) {
        console.log(result);
    } else {
        console.error(error);
    }
}).on("data", (transactionHash) => {
    web3.eth.getTransaction(transactionHash)
        .then((transaction) => {
            if (transaction.to === address || transaction.from === address) {
                console.log('Transaction detected:', transaction);
            }
        });
});
