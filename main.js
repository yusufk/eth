// Buy Yusuf a coffee — ETH tip jar
// Wallet address and amount preserved from the original.
const PAY_TO = "0xd5838aD056eaD570111b99D465563854cd00e54A";
const AMOUNT_ETH = "0.001";

const connectButton = document.getElementById('connectMetaMaskButton');
const buyButton = document.getElementById('buyButton');
const showAccount = document.getElementById('metaAccount');
const account = document.getElementById('account');
const redirectButton = document.getElementById('redirectButton');
const mobile = document.getElementById('mobile');
const desktop = document.getElementById('desktop');
const statusEl = document.getElementById('status');
const copyButton = document.getElementById('copyAddress');
const payAddress = document.getElementById('payAddress');

let provider;
let signer;
let accounts = [];

function setStatus(msg, type = 'info') {
   statusEl.textContent = msg;
   statusEl.className = 'status ' + type;
}

// Robust mobile detection (userAgentData is non-standard / absent in Safari & Firefox)
function isMobileDevice() {
   const uaData = navigator.userAgentData;
   if (uaData && typeof uaData.mobile === 'boolean') return uaData.mobile;
   return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
   mobile.hidden = false;
   desktop.hidden = true;
} else {
   desktop.hidden = false;
   mobile.hidden = true;
   // Only offer the connect button if a wallet is actually injected
   if (typeof window.ethereum === 'undefined') {
      connectButton.disabled = true;
      setStatus('No Ethereum wallet detected. Install MetaMask, or scan the QR below.', 'info');
   }
}

redirectButton?.addEventListener('click', () => {
   // MetaMask mobile deep link: send 0.001 ETH (1e15 wei) on mainnet (chain 1)
   window.location.href =
      `https://metamask.app.link/send/${PAY_TO}@1?value=1e15`;
});

connectButton?.addEventListener('click', connectWallet);
buyButton?.addEventListener('click', sendETH);

copyButton?.addEventListener('click', async () => {
   try {
      await navigator.clipboard.writeText(PAY_TO);
      copyButton.textContent = 'Copied!';
      setTimeout(() => (copyButton.textContent = 'Copy'), 1500);
   } catch {
      setStatus('Copy failed — select the address manually.', 'error');
   }
});

async function connectWallet() {
   if (typeof window.ethereum === 'undefined') {
      setStatus('No Ethereum wallet detected. Install MetaMask, or scan the QR below.', 'error');
      return;
   }
   try {
      setStatus('Connecting…', 'info');
      // Create the provider lazily, only once a wallet exists
      provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      accounts = await provider.send('eth_requestAccounts', []);
      signer = provider.getSigner();
      const short = accounts[0].slice(0, 6) + '…' + accounts[0].slice(-4);
      showAccount.textContent = short;
      account.hidden = false;
      buyButton.disabled = false;
      connectButton.textContent = '🦊 Connected';
      setStatus('Wallet connected. You can send your coffee now ☕', 'success');
   } catch (err) {
      console.error(err);
      setStatus(err?.code === 4001 ? 'Connection rejected.' : 'Could not connect wallet.', 'error');
   }
}

async function sendETH() {
   if (!signer) {
      setStatus('Connect your wallet first.', 'error');
      return;
   }
   try {
      setStatus('Confirm the transaction in MetaMask…', 'info');
      const tx = await signer.sendTransaction({
         to: PAY_TO,
         value: ethers.utils.parseEther(AMOUNT_ETH),
      });
      setStatus('Sent! Waiting for confirmation…', 'info');
      await tx.wait();
      setStatus('Thank you for the coffee! ☕💛', 'success');
      buyButton.disabled = true;
   } catch (err) {
      console.error(err);
      setStatus(err?.code === 4001 ? 'Transaction cancelled.' : 'Transaction failed.', 'error');
   }
}
