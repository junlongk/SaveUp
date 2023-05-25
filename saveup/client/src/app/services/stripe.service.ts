import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private STRIPE_URL = "/api/stripe";
  private GET_SECRET_URL = "/api/stripe/secret";

  constructor(private httpClient: HttpClient) { }

  getSecret(): Promise<any> {

    const response = lastValueFrom(this.httpClient
      .get(this.GET_SECRET_URL));

    return response;
  }
}
