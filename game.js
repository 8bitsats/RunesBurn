import { Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const WalletConnectionComponent = () => {
    const wallet = useWallet();
    const connection = new Connection(clusterApiUrl('devnet')); // Or 'mainnet-beta'
    const mintAddress = new PublicKey('AAXzWyHFErx9MzgiDKSxRZ14VAYjW7Pv6xEqpnSLXPL9');
    const burnerAddress = new PublicKey('DeadDropAddressHere'); // Replace with the actual burner address
    let tokenCount = 10;

    const fetchTokenBalance = async () => {
        const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, wallet.publicKey);
        const userTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(wallet.publicKey);
        return userTokenAccountInfo.amount.toNumber();
    };

    const burnToken = async () => {
        const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, wallet.publicKey);
        const userTokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(wallet.publicKey);
        const transaction = new Transaction().add(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                userTokenAccountInfo.address,
                burnerAddress,
                wallet.publicKey,
                [],
                1 // Assuming 1 token to burn, adjust as needed
            )
        );
        const signature = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'processed');
        return await fetchTokenBalance();
    };

    return (
        <div>
            <p>Tokens: {tokenCount}</p>
            <button onClick={async () => {
                if (!wallet.connected) {
                    alert('Please connect your wallet first!');
                    return;
                }
                try {
                    const newBalance = await burnToken();
                    tokenCount = newBalance;
                    alert('Token burned successfully!');
                } catch (error) {
                    console.error('Failed to burn token:', error);
                    alert(`Error: ${error.message}`);
                }
            }}>
                Burn Token
            </button>
        </div>
    );
};
