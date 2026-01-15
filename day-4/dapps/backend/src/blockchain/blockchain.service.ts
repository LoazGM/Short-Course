import { Injectable } from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './simple-storage.json';

@Injectable()
export class BlockchainService {
  private client: PublicClient;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });

    // GANTI dengan address hasil deploy Day 2
    this.contractAddress =
      '0x51773AD0E1Be803b2637C3f7b0A52Ae526E96BBe' as `0x${string}`;
  }

  // 🔹 Read latest value
  async getLatestValue(): Promise<{ value: string }> {
    const value = (await this.client.readContract({
      address: this.contractAddress,
      abi: SIMPLE_STORAGE.abi,
      functionName: 'getValue',
    })) as bigint;

    return {
      value: value.toString(),
    };
  }

  // 🔹 Read ValueUpdated events
  async getValueUpdatedEvents(
    fromBlock: number,
    toBlock: number,
    page = 1,
    limit = 10,
  ) {
    try {
      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: 'event',
          name: 'ValueUpdated',
          inputs: [
            {
              name: 'newValue',
              type: 'uint256',
              indexed: false,
            },
          ],
        },
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      const filtered = events
        .filter(
          (event): event is typeof event & { args: { newValue: bigint } } =>
            event.args?.newValue !== undefined,
        )
        .map((event) => ({
          blockNumber: event.blockNumber?.toString(),
          value: event.args.newValue.toString(),
          txHash: event.transactionHash,
        }));

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        success: true,
        data: filtered.slice(start, end),
        meta: {
          page,
          limit,
          total: filtered.length,
        },
      };
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: 'Failed to fetch events',
        error: errorMessage,
      };
    }
  }
}
