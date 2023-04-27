import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {JwtAuthService} from "./services/jwt-auth.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
    MainPageComponent,
    BudgetsComponent,
    TransactionsComponent,
    AccountsComponent,
    UserPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ JwtAuthService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
