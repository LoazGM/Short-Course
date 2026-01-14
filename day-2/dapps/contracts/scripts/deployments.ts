import { viem } from "hardhat";

import Artifact from "../artifacts/contracts/simple-storage.sol/SimpleStorage.json";

async function main() {
    // Wallet Client (signer)
    const [WalletClient] = await viem.getWalletClients();

    // Public Client (read-only)
    const PublicClient = await viem.getPublicClient();

    console.log("Deploying with account:", WalletClient.account.address);

    // Deploy Contract
    const hash = await WalletClient.deployContract({
        abi: Artifact.abi,
        bytecode: Artifact.bytecode as `0x${string}`,
        args: [],
    });

    console.log("Deployment tx hash:", hash);

    // Wait for confirmation
    const receipt = await PublicClient.waitForTransactionReceipt({ hash });

    console.log("✅ SimpleStorage deployed at:", receipt.contractAddress);}

    main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
