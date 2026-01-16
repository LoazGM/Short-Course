const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");

// Avalanche Fuji Testnet chainId (hex)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  console.log({ balance });
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    return;
  }

  console.log("window.ethereum", window.ethereum);

  try {
    statusEl.textContent = "Connecting...";

    // Request wallet accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    addressEl.textContent = shortenAddress(address);

    console.log({ address });

    // Get chainId
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    console.log({ chainId });

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";
      connectBtn.disabled = true;
      connectBtn.textContent = "Connected";
      connectBtn.style.opacity = "0.6";


      // Get AVAX balance
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      console.log({ balanceWei });

      balanceEl.textContent = formatAvaxBalance(balanceWei);
    } else {
      networkEl.textContent = "Wrong Network ❌";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "#fbc531";
      balanceEl.textContent = "-";
    }
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Connection Failed ❌";
  }
}

connectBtn.addEventListener("click", connectWallet);

if (window.ethereum) {
  ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      resetUI();
    } else {
      connectWallet();
    }
  });
}

ethereum.on("chainChanged", () => {
  window.location.reload();
});

function showError(message) {
  statusEl.textContent = message;
  statusEl.style.color = "#e84142";
}

function resetUI() {
  statusEl.textContent = "Not Connected";
  statusEl.style.color = "#ffffff";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
  connectBtn.disabled = false;
  connectBtn.textContent = "Connect Wallet";
  connectBtn.style.opacity = "1";
}
