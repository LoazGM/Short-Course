'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalancheFuji } from 'wagmi/chains';

// ==============================
// 🔹 CONFIG
// ==============================
const CONTRACT_ADDRESS = '0x51773AD0E1Be803b2637C3f7b0A52Ae526E96BBe';

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// ==============================
// 🔹 HELPER
// ==============================
const shortenAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

export default function Page() {
  // ==============================
  // 🔹 WALLET STATE
  // ==============================
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  

  // ==============================
  // 🔹 LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  

  // ==============================
  // 🔹 READ CONTRACT
  // ==============================
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  // ==============================
  // 🔹 WRITE CONTRACT
  // ==============================
  const {
    writeContractAsync,
    isPending: isWriting,
  } = useWriteContract();

  // ==============================
  // 🔹 WAIT TX CONFIRMATION
  // ==============================
  const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // ==============================
  // 🔹 AUTO REFRESH AFTER TX SUCCESS
  // ==============================
  useEffect(() => {
  if (isTxSuccess) {
    refetch();
    alert('✅ Value updated on blockchain!');
  }
}, [isTxSuccess, refetch]);


  // ==============================
  // 🔹 HANDLER
  // ==============================
  const handleSetValue = async () => {
    if (!inputValue) return;

    if (chainId !== avalancheFuji.id) {
      alert('❌ Please switch to Avalanche Fuji Testnet');
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [BigInt(inputValue)],
      });

      setTxHash(hash);
      alert('⏳ Transaction sent, waiting confirmation...');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`❌ Transaction failed\n${err.message}`);
      } else {
        alert('❌ Transaction failed');
      }
    }
  };

  // ==============================
  // 🔹 UI
  // ==============================
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-lg p-6 space-y-6">

        <h1 className="text-xl font-bold">
          Day 3 – Frontend dApp (Avalanche)
        </h1>

        {/* ==========================
            WALLET CONNECT
        ========================== */}
        
        <p className="text-xs text-gray-500 pt-2">
          Arya Shevana HK_241011401237
        </p>
        
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full bg-white text-black py-2 rounded disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Connected Address</p>
            <p className="font-mono text-sm">
              {shortenAddress(address)}
            </p>

            <button
              onClick={() => disconnect()}
              className="text-red-400 text-sm underline"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* ==========================
            READ CONTRACT
        ========================== */}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-sm text-gray-400">Contract Value</p>

          {isReading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold">
              {value?.toString()}
            </p>
          )}

          <button
            onClick={() => refetch()}
            className="text-sm underline text-gray-300"
          >
            Refresh value
          </button>
        </div>

        {/* ==========================
            WRITE CONTRACT
        ========================== */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <p className="text-sm text-gray-400">Update Contract Value</p>

          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded bg-black border border-gray-600"
          />

          <button
            onClick={handleSetValue}
            disabled={isWriting || !isConnected}
            className="w-full bg-blue-600 py-2 rounded disabled:opacity-50"
          >
            {isWriting ? 'Transaction Pending...' : 'Set Value'}
          </button>
        </div>

        <p className="text-xs text-gray-500 pt-2">
          Smart contract = single source of truth
        </p>

      </div>
    </main>
  );
}
