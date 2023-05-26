import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  private CREATE_PAYMENT_INTENT_URL = "/api/stripe/create-payment-intent";

  constructor(private httpClient: HttpClient) { }

  createPaymentIntent(): Promise<any> {

    return lastValueFrom(this.httpClient
      .get(this.CREATE_PAYMENT_INTENT_URL));
  }
}
