// app/page.tsx (SERVER COMPONENT)
import {
  getBlockchainValue,
  getBlockchainEvents,
} from "@/src/services/blockchain.service";
import WalletClient from "@/components/WalletClient";

export default async function HomePage() {
  const value = await getBlockchainValue();
  const events = await getBlockchainEvents();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Day 5 – Full Stack dApp</h1>

      <section className="border p-4 rounded">
        <h2 className="font-semibold">Latest Value (Backend)</h2>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </section>

      <section className="border p-4 rounded">
        <h2 className="font-semibold">Events</h2>
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </section>

      {/* Client Component */}
      <WalletClient />
    </main>
  );
}
