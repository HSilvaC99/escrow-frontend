import { useEffect, useState } from "preact/hooks";
import { ethers } from "ethers";

interface SimpleTx {
  hash: string;
  from: string;
  to: string;
  value: string;
}

export default function TransactionList() {
  const [account, setAccount] = useState<string | null>(null);
  const [txs, setTxs] = useState<SimpleTx[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch(() => {
          setError("No se pudo obtener la cuenta");
        });

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setTxs([]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.off("accountsChanged", handleAccountsChanged);
      };
    } else {
      setError("Por favor, instale Metamask");
    }
  }, []);

  useEffect(() => {
    async function fetchTxs(addr: string) {
      try {
        const provider = new ethers.EtherscanProvider(
          "sepolia",
          import.meta.env.PUBLIC_ETHERSCAN_API_KEY
        );
        const history = await provider.getHistory(addr);
        const lastFive = history.slice(-5).reverse();
        const simplified = lastFive.map((tx) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to ?? "",
          value: ethers.formatEther(tx.value),
        }));
        setTxs(simplified);
      } catch (err) {
        console.error(err);
        setError("Error al obtener transacciones");
      }
    }

    if (account) {
      fetchTxs(account);
    }
  }, [account]);

  if (error) {
    return <p class="text-red-500">{error}</p>;
  }

  if (!account) {
    return <p class="text-yellow-300">Conecte su cuenta en Metamask</p>;
  }

  if (txs.length === 0) {
    return <p class="text-gray-400">No hay transacciones recientes</p>;
  }

  return (
    <ul class="w-full max-w-xl mt-4 space-y-2">
      {txs.map((tx) => (
        <li key={tx.hash} class="border p-2 rounded-lg bg-light dark:bg-dark">
          <p class="text-xs break-all">
            <strong>Hash:</strong> {tx.hash}
          </p>
          <p class="text-xs break-all">
            <strong>De:</strong> {tx.from}
          </p>
          <p class="text-xs break-all">
            <strong>Para:</strong> {tx.to}
          </p>
          <p class="text-xs">
            <strong>Valor:</strong> {tx.value} ETH
          </p>
        </li>
      ))}
    </ul>
  );
}
