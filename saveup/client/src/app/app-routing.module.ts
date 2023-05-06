import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./components/main-page/main-page.component";
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {UserPageComponent} from "./components/user-page/user-page.component";
import {TransactionsComponent} from "./components/transactions/transactions.component";
import {BudgetsComponent} from "./components/budgets/budgets.component";
import {AccountsComponent} from "./components/accounts/accounts.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user', component: UserPageComponent, canActivate: [ AuthGuard ],
      children: [
        { path: 'budgets', component: BudgetsComponent },
        { path: 'transactions', component: TransactionsComponent },
        { path: 'accounts', component: AccountsComponent },
        { path: 'accounts/:accountId', component: AccountsComponent }
      ]},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
