// wallet.js
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const walletContainer = document.getElementById('wallet-container');
const gameContainer = document.getElementById('game-container');

const network = clusterApiUrl('devnet'); // Change to 'mainnet-beta' for production
const connection = new Connection(network);
const wallet = useWallet();

async function connectWallet() {
    if (!wallet.connected) {
        await wallet.connect();
        walletContainer.innerHTML = '<p>Wallet connected: ' + wallet.publicKey + '</p>';
        gameContainer.classList.remove('hidden');
    }
}

walletContainer.innerHTML = '<button onclick="connectWallet()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Connect Wallet</button>';

