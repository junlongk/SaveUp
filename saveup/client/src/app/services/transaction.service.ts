import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {Transaction} from "../models/Transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private TRANSACTIONS_URL = "/api/transactions";
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
}
