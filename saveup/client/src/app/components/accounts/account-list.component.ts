import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/Account";
import {AuthService} from "../../auth/auth.service";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  userId!: string;
  accounts: Account[] = [];
  menuItems!: MenuItem[];
  selectedAccount!: string;

  constructor(private accountsSvc: AccountService,
              private authSvc: AuthService,
              private router: Router) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.accountsSvc.getAccounts(this.userId)
      .then(data => {
        this.accounts = data;
        console.info('>>> accounts: ', this.accounts);
      });

    this.menuItems = [
      {
        label: 'Details',
        icon: 'pi pi-list',
        command: () => {
          this.goToAccountPage(this.selectedAccount);
          console.info('>>> navigating to account page:', this.selectedAccount);
        }
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          this.edit();
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.delete();
        }
      }
    ];
  }

  private goToAccountPage(accountId: string) {
    this.router.navigate(['/user/accounts', accountId]);
  }

  private edit() {

  }

  private delete() {

  }
}
