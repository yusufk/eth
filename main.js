const connectButton = document.getElementById('connectMetaMaskButton');
const buyButton = document.getElementById('buyButton');
const showAccount = document.getElementById('metaAccount');
var signer;
var accounts;

connectButton.addEventListener('click', () => {
    getAccount();
});

buyButton.addEventListener('click', () => {
    sendETH();
});

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

async function getAccount() {
    accounts = await provider.send("eth_requestAccounts", []);
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    console.log("Accounts: " + accounts);
    signer = provider.getSigner()
    showAccount.innerHTML = accounts[0];
    buyButton.disabled = false;
}

// Send ETH using a transaction
async function sendETH() {
    const tx = {
        from: accounts[0],
        to: "0xd5838aD056eaD570111b99D465563854cd00e54A",
        value: ethers.utils.parseEther("0.001"),
        nonce: await provider.getTransactionCount(accounts[0], "latest"),
        gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
        gasLimit: ethers.utils.hexlify(10000),
    };
    signer.sendTransaction(tx)
    .then((transaction) => {
        console.dir(transaction);
        alert("Thanks!");
    })
    .catch((error) => {
        console.log(error);
        alert("Awww, that didn'work!");
    });
};


