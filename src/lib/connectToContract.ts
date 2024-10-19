import { ethers } from "ethers";
import CONTRACT_BYTECODE from "@/contract/bytecode.json";
import CONTRACT_ABI from "@/contract/abi.json";

export default async function connectToContract(
  ethereum: any,
  payee: string,
  agent: string,
  amount: number
): Promise<string> {
  if(!ethereum) {
    throw new Error("Metamask not installed");
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner() as any;

  const contractFactory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, signer);

  const contract = await contractFactory.deploy(payee, agent, {
    from: signer.address,
    value: ethers.parseEther(amount.toString())
  });

  await contract.waitForDeployment();

  return contract.getAddress();
}