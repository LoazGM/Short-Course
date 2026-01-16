"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { avalancheFuji } from "wagmi/chains";
import { useEffect, useState } from "react";
import { SIMPLE_STORAGE_ABI } from "@/src/contracts/abi/simpleStorage";
import { SIMPLE_STORAGE_ADDRESS } from "@/src/contracts/address";

export default function WalletClient() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [inputValue, setInputValue] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}`>();

  const { data: value, refetch } = useReadContract({
    address: SIMPLE_STORAGE_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  const { writeContractAsync } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  const handleSetValue = async () => {
    if (chainId !== avalancheFuji.id) {
      alert("Switch to Avalanche Fuji");
      return;
    }

    const hash = await writeContractAsync({
      address: SIMPLE_STORAGE_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(inputValue)],
    });

    setTxHash(hash);
  };

  return (
    <section className="border p-4 rounded space-y-3">
      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>{address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
          <p>Value: {value?.toString()}</p>

          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSetValue}>Set Value</button>
        </>
      )}
    </section>
  );
}
