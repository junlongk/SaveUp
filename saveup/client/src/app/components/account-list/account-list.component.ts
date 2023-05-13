import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/Account";
import {AuthService} from "../../auth/auth.service";
import {MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AccountFormComponent} from "../account-form/account-form.component";

@Component({
  selector: 'app-accounts',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  providers: [ DialogService, MessageService ]
})
export class AccountListComponent implements OnInit, OnDestroy {
  userId!: string;
  accounts: Account[] = [];
  menuItems!: MenuItem[];
  selectedAccount!: Account;
  ref!: DynamicDialogRef;

  constructor(private accountSvc: AccountService,
              private authSvc: AuthService,
              private router: Router,
              public dialogSvc: DialogService,
              public messageSvc: MessageService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.accountSvc.getAccounts(this.userId)
      .then(data => {
        this.accounts = data;
        console.info('>>> accounts found: ', this.accounts);
      });

    this.menuItems = [
      {
        label: 'Details',
        icon: 'pi pi-list',
        command: () => {
          // pass in accountId for routing
          this.goToAccountPage(this.selectedAccount.accountId);
          console.info('>>> navigating to account page:', this.selectedAccount.accountId);
        }
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          // pass in account details for editing
          this.edit(this.selectedAccount);
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          this.delete(this.selectedAccount);
        }
      }
    ];
  }

  private goToAccountPage(accountId: string) {
    this.router.navigate(['/user/accounts', accountId]);
  }

  private edit(account: Account) {
    console.info('inside account-list edit button: ',account);
    this.ref = this.dialogSvc.open(AccountFormComponent, {
      data: account, // pass in account details to form component
      header: 'Edit account details',
      width: '300px',
      height: '300px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((account: Account) => {
      console.info('subscribed account: ', account);

      this.accountSvc.modifyAccount(account)
        .then( data => {
          console.info('>>> msg from server: ', data.message);

          // refresh account list after submitting form
          this.accountSvc.getAccounts(this.userId)
            .then(data => {
              this.accounts = data;
              console.info('>>> refreshed accounts: ', this.accounts);
            });
        });
    });
  }

  private delete(account: Account) {

  }

  create() {
    this.ref = this.dialogSvc.open(AccountFormComponent, {
      header: 'Add new account',
      width: '300px',
      height: '300px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((account: Account) => {
      console.info('subscribed account: ', account);

      this.accountSvc.addAccount(account)
        .then( data => {
          console.info('>>> msg from server: ', data.message);

          // refresh account list after submitting form
          this.accountSvc.getAccounts(this.userId)
            .then(data => {
              this.accounts = data;
              console.info('>>> refreshed accounts: ', this.accounts);
            });
        });
    });
  }

  ngOnDestroy():void {
    if (this.ref) {
      this.ref.close();
    }
  }
}