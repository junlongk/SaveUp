import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
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
import { AccountDetailComponent } from "./components/account-detail/account-detail.component";
import { AccountFormComponent } from "./components/account-form/account-form.component";
import { TransactionService } from "./services/transaction.service";
import { TransactionFormComponent } from "./components/transaction-form/transaction-form.component";
import { DatePipe } from "@angular/common";
import {StripeService} from "./services/stripe.service";
import {PaymentCancelComponent} from "./components/payment-cancel/payment-cancel.component";
import {PaymentSuccessComponent} from "./components/payment-success/payment-success.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";

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
    BudgetsComponent,
    TransactionListComponent,
    TransactionFormComponent,
    AccountListComponent,
    AccountFormComponent,
    AccountDetailComponent,
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
    PrimengModule
  ],
  providers: [
    AuthService,
    AccountService,
    TransactionService,
    DatePipe,
    StripeService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
