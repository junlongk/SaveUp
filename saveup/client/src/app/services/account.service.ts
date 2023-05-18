import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {Account} from "../models/Account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private ACCOUNTS_URL = "/api/accounts";
  private MODIFY_ACCOUNT_URL = "/api/accounts/modify";
  constructor(private httpClient: HttpClient) { }

  getAccounts(userId: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const params = new HttpParams()
      .set("userId", userId);

    return lastValueFrom(this.httpClient
      .get<Account[]>(this.ACCOUNTS_URL, { params, headers }));
  }

  addAccount(account: Account): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const body = JSON.stringify(account);

    return lastValueFrom(this.httpClient
      .post<Account>(this.ACCOUNTS_URL, body, { headers }));
  }

  modifyAccount(account: Account): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const body = JSON.stringify(account);

    return lastValueFrom(this.httpClient
      .put<Account>(this.MODIFY_ACCOUNT_URL, body, { headers }));
  }

  deleteAccount(accountId: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    return lastValueFrom(this.httpClient
      .delete<Account>(this.ACCOUNTS_URL + "/delete/" + accountId, { headers }));
  }
}
