import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth/auth.service";
import { JwtModule } from "@auth0/angular-jwt";
import { PrimengModule } from "./primeng.module";
import { PrimeNGConfig } from "primeng/api";
import { AccountService } from "./services/account.service";
import { AccountFormComponent } from "./components/account-form/account-form.component";
import { TransactionService } from "./services/transaction.service";
import { TransactionFormComponent } from "./components/transaction-form/transaction-form.component";
import { DatePipe } from "@angular/common";
import {StripePaymentService} from "./services/stripe-payment.service";
import {PaymentCancelComponent} from "./components/payment-cancel/payment-cancel.component";
import {PaymentSuccessComponent} from "./components/payment-success/payment-success.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {NgxStripeModule} from "ngx-stripe";
import {environment} from "../environments/environment";
import { ServiceWorkerModule } from '@angular/service-worker';
import {AccountTransferFormComponent} from "./components/account-transfer-form/account-transfer-form.component";

// used for enabling PrimeNG ripple effects throughout the app
const initializeAppFactory = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
    MainPageComponent,
    ReportsComponent,
    TransactionListComponent,
    TransactionFormComponent,
    AccountListComponent,
    AccountFormComponent,
    AccountTransferFormComponent,
    UserPageComponent,
    CheckoutComponent,
    PaymentCancelComponent,
    PaymentSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
    PrimengModule,
    NgxStripeModule.forRoot(environment.stripe),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    AuthService,
    AccountService,
    TransactionService,
    DatePipe,
    StripePaymentService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
