interface FormData {
  payee_address: string;
  agent_address: string;
  amount: number;
  error: {
    "payee_address": boolean,
    "agent_address": boolean,
    "amount": boolean
  }
}

export default function validateFormData(payee_address: string, agent_address: string, amount: number) {
  const regex = /^(0x)?[0-9a-fA-F]{40}$/;
  const error = {
    "error_payee": !regex.test(payee_address),
    "error_agent": !regex.test(agent_address),
    "error_amount": amount <= 0
  };
  return { payee_address, agent_address, amount, error };
}
