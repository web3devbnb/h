const Web3 = require('web3');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

const addresses = require('./addresses.json');
const mumbaiTestnet = process.env.MUMBAI_TESTNET;

const subscription = web3.eth.subscribe('pendingTransactions', (error, result) => {
    if (!error) {
        console.log(result);
    } else {
        console.error(error);
    }
}).on("data", (transactionHash) => {
    web3.eth.getTransaction(transactionHash)
        .then((transaction) => {
            addresses.forEach((address) => {
                if (transaction.to === address || transaction.from === address) {
                    console.log('Transaction detected:', transaction);
                    sendAirdrop(transaction);
                }
            });
        });
});

async function sendAirdrop(transaction) {
    addresses.forEach((address) => {
        const airdropData = {
            from: process.env.FROM_ADDRESS,
            to: address,
            value: web3.utils.toWei('100', 'ether'),
            gas: process.env.GAS,
            gasPrice: web3.utils.toWei(process.env.GAS_PRICE, 'gwei')
        };
    });

    const signedTransaction = await web3.eth.accounts.signTransaction(airdropData, process.env.PRIVATE_KEY);

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
