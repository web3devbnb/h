const Web3 = require('web3');
const axios = require('axios');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'; // Replace with the address you want to watch
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
        to: '0xRecipientAddress', // Replace with recipient's address
        value: web3.utils.toWei('1', 'ether'), // Replace with the amount you want to send
        gas: 21000,
        gasPrice: web3.utils.toWei('30', 'gwei')
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
