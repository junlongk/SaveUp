import {Component, OnInit, ViewChild} from '@angular/core';
import {StripePaymentElementComponent, StripeService} from "ngx-stripe";
import {StripePaymentService} from "../../services/stripe-payment.service";
import {StripeElementsOptions} from "@stripe/stripe-js";
import {AuthService} from "../../auth/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  userId!: string;

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance: {
      theme: 'night',
      labels: 'floating'
    }
  }

  constructor(private stripePaymentSvc: StripePaymentService,
              private stripSvc: StripeService,
              private authSvc: AuthService,
              private jwtHelperSvc: JwtHelperService,
              private router: Router) { }

  ngOnInit():void {
    this.stripePaymentSvc.createPaymentIntent()
      .then(data => {
        this.elementsOptions.clientSecret = data.client_secret;
      });
  }

  pay() {
    this.stripSvc.confirmPayment({
      elements: this.paymentElement.elements,
      redirect: "if_required"
    }).subscribe(result => {
      console.info('Result', result);

      if (result.error) {
        console.error(result.error.message);
        this.router.navigate(['/payment-cancel']);
      }

      else if (result.paymentIntent.status === 'requires_payment_method') {
        this.router.navigate(['/payment-cancel']);
      }

      else if (result.paymentIntent.status === 'succeeded') {
        // get userId
        this.userId = this.authSvc.getUserId();

        this.authSvc.updatePremium(this.userId)
          .then(result => {
            const jwtToken = result.token;
            console.info('>>> jwtToken: ', jwtToken);

            // decode token
            console.info('>>> token decoded: ',
            this.jwtHelperSvc.decodeToken(jwtToken));

            if(jwtToken.length > 0) {
              localStorage.setItem('token', jwtToken);
              this.router.navigate(['/payment-success']);
            }
          });
      }
    });
  }

  goBack() {
    this.router.navigate(['/user']);
  }
}
