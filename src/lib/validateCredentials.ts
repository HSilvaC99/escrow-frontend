export interface ValidationError {
  payee_address: boolean;
  agent_address: boolean;
  amount: boolean;
}

export interface ValidationResult {
  payee_address: string;
  agent_address: string;
  amount: number;
  error: ValidationError;
}

const validateFormData = (
  payee: string,
  agent: string,
  amount: number
): ValidationResult => {
    let error_payee = false;
    let error_agent = false;
    let error_amount = false;

  const isValidAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);

  if (!isValidAddress(payee)) {
    error_payee = true;
  }

  if (!isValidAddress(agent)) {
    error_agent = true;
  }

  if (isNaN(amount) || amount <= 0) {
    error_amount = true;
  }

  return {
    payee_address: payee,
    agent_address: agent,
    amount: amount,
    error: {
      payee_address: error_payee,
      agent_address: error_agent,
      amount: error_amount
    },
  };
};

export default validateFormData;