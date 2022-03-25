const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');

ethereumButton.addEventListener('click', () => {
    getAccount();
});

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

async function getAccount() {
    const accounts = await provider.send("eth_requestAccounts", []);
    const defaultAccount = accounts[0];
    showAccount.innerHTML = defaultAccount;
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
    // Creating a transaction param
    const tx = {
        from: defaultAccount,
        to: "0xd5838aD056eaD570111b99D465563854cd00e54A",
        value: ethers.utils.parseEther("0.0025"),
        nonce: await provider.getTransactionCount(defaultAccount, "latest"),
        gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
        gasLimit: ethers.utils.hexlify(10000),
    };

    signer.sendTransaction(tx).then((transaction) => {
        console.dir(transaction);
        alert("Send finished!");
    });
}



