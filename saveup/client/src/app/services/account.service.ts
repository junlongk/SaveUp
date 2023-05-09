import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {User} from "../models/User";
import {lastValueFrom} from "rxjs";
import {UserLogin} from "../models/UserLogin";
import {Account} from "../models/Account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private ACCOUNTS_URL = "/api/accounts";
  private MODIFY_ACCOUNT_URL = "/api/accounts/modifybalance";
  constructor(private httpClient: HttpClient) { }

  getAccounts(userId: string): Promise<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    const params = new HttpParams()
      .set("userId", userId);

    return lastValueFrom(this.httpClient
      .get<Account[]>(this.ACCOUNTS_URL, { params, headers }));
  }

  // FOR REFERENCE ONLY - DELETE AFTER DONE
  //
  // signupUser(user: User): Promise<any> {
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json; charset=utf-8');
  //
  //   const body = JSON.stringify(user);
  //
  //   return lastValueFrom(this.httpClient
  //     .post<User>(this.REGISTER_URL, body, { headers }));
  // }
  //
  // loginUser(userLogin: UserLogin): Promise<any> {
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json; charset=utf-8');
  //
  //   const body = JSON.stringify(userLogin);
  //
  //   return lastValueFrom(this.httpClient
  //     .post<UserLogin>(this.LOGIN_URL, body, { headers }));
  // }
}
