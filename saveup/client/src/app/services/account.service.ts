import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private ACCOUNTS_URL = "/api/accounts";
  private MODIFY_ACCOUNT_URL = "/api/accounts/modifybalance";
  constructor(private httpClient: HttpClient,
              ) { }
}
