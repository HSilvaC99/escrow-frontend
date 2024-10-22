import { useEffect, useState } from "preact/hooks";
import MetaMaskIcon from "@components/icons/MetaMask";
import FormField from "@components/UniqueComponents/FormField";
import AmountField from "@components/UniqueComponents/AmountField";
import connectToContract from "@lib/connectToContract";
import validateFormData from "@lib/validateCredentials";
import ErrorLabel from "@components/UniqueComponents/ErrorLabel";

interface Errors {
  payee_address: boolean;
  agent_address: boolean;
  amount: boolean;
}

export default function Form() {
  const [payee, setPayee] = useState<string>("");
  const [agent, setAgent] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({
    payee_address: false,
    agent_address: false,
    amount: false,
  });

  const [status, setStatus] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [account, setAccount] = useState<string | null>(null);
  const [touched, setTouched] = useState<{
    payee_address: boolean;
    agent_address: boolean;
    amount: boolean;
  }>({
    payee_address: false,
    agent_address: false,
    amount: false,
  });

  useEffect(() => {
    if(window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if(accounts.length > 0) {
          setAccount(accounts[0]);
          setStatus(`Conectado: ${accounts[0]}`);
          localStorage.setItem("isMetaMaskConnected", "true");
        }
        else {
          setAccount(null);
          setStatus("");
          localStorage.removeItem("isMetaMaskConnected");
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      
      return () => {
        window.ethereum.off("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  useEffect(() => {
    const wasConnected = localStorage.getItem("isMetaMaskConnected") === "true";
    if(wasConnected && window.ethereum && !account) {
      handleConnectMetamask();
    }
  }, [account]);

  const isMetamaskConnected = () => {
    if(!window.ethereum) {
      alert("Por favor, instale Metamask!");
      return;
    }
  }

  const validateFields = (field: string, value: string) => {
    let error = '';

    const isValidAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);
    const isValidAmount = (amount: string) => !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

    switch(field) {
      case 'payee_address':
        error = isValidAddress(value) ? '' : 'Dirección del receptor inválida';
        break;
      case 'agent_address':
        error = isValidAddress(value) ? '' : 'Dirección del agente inválida';
        break;
      case 'amount':
        error = isValidAmount(value) ? '' : 'Importe inválido';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleConnectMetamask = async () => {
    isMetamaskConnected();

    try {
      const accounts: string[] = await window.ethereum.request!({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      setStatus(`Conectado: ${accounts[0]}`);
    } catch (error) {
      console.error("Error al conectar a Metamask", error);
      setStatus("Error al contectar con Metamask");
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isMetamaskConnected();

    const amountFloat = parseFloat(amount);
    const validation = validateFormData(payee, agent, amountFloat);
    setErrors(validation.error);

    if(validation.error.payee_address || validation.error.agent_address || validation.error.amount) {
      return;
    }

    try {
      setStatus("Desplegando contrato...");
      const contractAddr = await connectToContract(
        window.ethereum,
        validation.payee_address,
        validation.agent_address,
        validation.amount
      );

      setContractAddress(contractAddr);
      setStatus("Contrato desplegado con éxito!");
    } catch (error) {
      console.error("Error al desplegar el contrato", error);
      setStatus("Error al desplegar el contrato");
    }
  };

  return (
    <form onSubmit={handleSubmit} class="flex flex-col items-center max-w-96 min-w-full">
      <FormField
        id="payee_address"
        placeholder="0xa9fdef78..."
        type="text"
        label="Dirección del receptor"
        value={payee}
        onchange={(e) => {
          setPayee(e.currentTarget.value);
          validateFields('payee_address', e.currentTarget.value);
          setTouched((prev) => ({ ...prev, payee_address: true }));
        }}
      />
      {touched.payee_address && errors.payee_address && <ErrorLabel message="Direccion del receptor " />}

      <FormField
        id="agent_address"
        placeholder="0xba0e3c9a..."
        type="text"
        label="Dirección del agente"
        value={agent}
        onchange={(e) => {
            setAgent(e.currentTarget.value);
            validateFields('agent_address', e.currentTarget.value);
            setTouched((prev) => ({ ...prev, agent_address: true }));
          }
        }
      />
      {touched.agent_address && errors.agent_address && <ErrorLabel message="Direccion del agente " />}

      <AmountField
        id="amount"
        label="Cantidad"
        type="number"
        placeholder="10.00"
        value={amount}
        onchange={(e) => {
          setAmount(e.currentTarget.value);
          validateFields('amount', e.currentTarget.value);
          setTouched((prev) => ({ ...prev, amount: true }));
        }}
      />
      {touched.amount && errors.amount && <ErrorLabel message="Importe " />}

      { !account ? (
        <button
          type="button"
          onClick={handleConnectMetamask}
          class="font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center flex w-full max-w-96 justify-center mt-10 text-light dark:text-light bg-yellow-400 dark:bg-yellow-300 hover:scale-105 transition-transform hover:bg-yellow-500 hover:text-black dark:hover:text-black"
        > 
        <MetaMaskIcon />
        <span class="ms-1">Conectar con Metamask</span>
      </button>
      ) : (
        <button
          type="submit"
          onClick={handleSubmit}
          class={`font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center flex w-full max-w-96 justify-center mt-10 text-light dark:text-light bg-green-400 dark:bg-green-300${
            !payee || !agent || !amount || errors.payee_address || errors.agent_address || errors.amount
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:scale-105 transition-transform hover:text-black dark:hover:text-black hover:bg-green-500 '
          }`}
          disabled={!payee || !agent || !amount || errors.payee_address || errors.agent_address || errors.amount}
        >
          <span class="ms-1">Realizar transacción</span>
        </button>
      )}

      {status && <p class="mt-4 text-center text-sm text-red-500">{status}</p>}
      {contractAddress && (
        <p class="mt-2 text-center text-sm text-green-500">
          Dirección del contrato: {'  '}
          <span class="text-blue-400 text-sm font-bold underline">{contractAddress}</span>
        </p>
      )}
    </form>
  )
}