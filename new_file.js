const Web3 = require('web3');
const axios = require('axios');
const web3 = new Web3('https://mainnet.infura.io/v3/YourInfuraProjectID'); // Replace with your Infura project ID

const address = '0xYourAddress'; // Replace with the address you want to watch
const mumbaiTestnet = 'https://matic-mumbai.chainstacklabs.com';

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
                sendAirdrop(transaction);
            }
        });
});

async function sendAirdrop(transaction) {
    // Replace with your airdrop logic
    const airdropData = {
        from: '0xYourAddress', // Replace with your address
        to: transaction.from, // Send airdrop to the sender of the transaction
        value: web3.utils.toWei('1', 'ether'), // Replace with the amount you want to send
        gas: 'YourGas', // Replace with the gas for the Ethereum network
        gasPrice: web3.utils.toWei('YourGasPrice', 'gwei') // Replace with the gas price for the Ethereum network
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(airdropData, 'YourPrivateKey'); // Replace with your private key

    axios.post(mumbaiTestnet, {
        method: 'eth_sendRawTransaction',
        params: [signedTransaction.rawTransaction],
        id: 1,
        jsonrpc: '2.0'
    }).then((response) => {
        console.log('Airdrop sent:', response.data);
    }).catch((error) => {
        console.error('Error sending airdrop:', error);
    });
}
