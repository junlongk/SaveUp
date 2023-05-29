export interface Transaction {

  transactionId: string,
  accountId: string,
  accountName: string,
  date: Date,
  category: string,
  transferId: string,
  transferAccountId: string,
  transferAccountName: string,
  memo: string,
  outflow: number,
  inflow: number

}
