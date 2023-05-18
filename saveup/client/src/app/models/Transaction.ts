export interface Transaction {

  transactionId: string,
  accountId: string,
  accountName: string,
  date: Date,
  payee: string,
  payeeAccountId: string,
  payeeAccountName: string,
  envelopeId: string,
  envelopeName: string,
  memo: string,
  outflow: number,
  inflow: number

}
