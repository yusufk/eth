const connectButton = document.getElementById('connectMetaMaskButton');
const buyButton = document.getElementById('buyButton');
const showAccount = document.getElementById('metaAccount');
const accountText = document.getElementById('account');
var signer;
var accounts;

//Detect if the device is a mobile device
function isMobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

connectButton.addEventListener('click', () => {
    if (isMobile()) {
        //redirect the page
        window.location.href = "https://metamask.app.link/send/0xd5838aD056eaD570111b99D465563854cd00e54A?value=1e15";
    } else {
    getAccount();
    }
});

buyButton.addEventListener('click', () => {
    sendETH();
});

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum,"any")

async function getAccount() {
    accounts = await provider.send("eth_requestAccounts", []);
    showAccount.innerHTML = accounts[0];
    buyButton.disabled = false;
    accountText.disabled = false;
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    signer = provider.getSigner()
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


