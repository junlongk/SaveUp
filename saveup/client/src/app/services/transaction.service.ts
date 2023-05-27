import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {Transaction} from "../models/Transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private TRANSACTIONS_URL = "/api/transactions";
  private MODIFY_TRANSACTION_URL = "/api/transactions/modify";
  private DELETE_TRANSACTION_URL = "/api/transactions/delete/";
  private MODIFY_ACCOUNTNAME_URL = "/api/transactions/modifyaccountname";

  constructor(private httpClient: HttpClient) { }

  getTransactions(userId: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const params = new HttpParams()
      .set("userId", userId);

    return lastValueFrom(this.httpClient
      .get<Transaction[]>(this.TRANSACTIONS_URL, { params, headers }));
  }

  addTransaction(transaction: Transaction): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const body = JSON.stringify(transaction);

    return lastValueFrom(this.httpClient
      .post<Transaction>(this.TRANSACTIONS_URL, body, { headers }));
  }

  modifyTransaction(transaction: Transaction): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const body = JSON.stringify(transaction);

    return lastValueFrom(this.httpClient
      .put<Transaction>(this.MODIFY_TRANSACTION_URL, body, { headers }));
  }

  deleteTransaction(transactionId: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    return lastValueFrom(this.httpClient
      .delete<Transaction>(this.DELETE_TRANSACTION_URL + transactionId, { headers }));
  }

  modifyAccountName(accountId: string, newAccountName: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const body = JSON.stringify({
      accountId: accountId,
      newAccountName: newAccountName
    });

    return lastValueFrom(this.httpClient
      .put(this.MODIFY_ACCOUNTNAME_URL, body, { headers }));
  }
}
