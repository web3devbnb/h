const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-INFURA-API-KEY');

const fromAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const toAddress = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88';

web3.eth.getBalance(fromAddress, (error, fromBalance) => {
 if (error) {
    console.error('Error fetching fromAddress balance:', error);
    return;
 }

 web3.eth.getBalance(toAddress, (error, toBalance) => {
    if (error) {
      console.error('Error fetching toAddress balance:', error);
      return;
    }

    if (fromBalance > 0 && toBalance === 0) {
      console.log('Ethereum transaction detected from', fromAddress, 'to', toAddress);
    }
 });
});
