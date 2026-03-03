export interface BankAccount {
  id: number;
  bank_name: string;
  account_holder_name: string;
  sort_code: string;
  account_number: string;
  client_id: number;
  current_value: number;
}

export interface NestedBankAccount {
  bank_name: string;
  account_holder_name: string;
  sort_code: string;
  account_number: string;
}