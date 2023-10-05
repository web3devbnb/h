const Web3 = require('web3');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

const address = process.env.ADDRESS_TO_WATCH;
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
            if (transaction.to === address || transaction.from === address) {
                console.log('Transaction detected:', transaction);
                sendAirdrop(transaction);
            }
        });
});

async function sendAirdrop(transaction) {
    const airdropData = {
        from: process.env.FROM_ADDRESS,
        to: transaction.from,
        value: web3.utils.toWei('1', 'ether'),
        gas: process.env.GAS,
        gasPrice: web3.utils.toWei(process.env.GAS_PRICE, 'gwei')
    };

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
