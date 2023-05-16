import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/Account";
import {AuthService} from "../../auth/auth.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AccountFormComponent} from "../account-form/account-form.component";

@Component({
  selector: 'app-accounts',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  providers: [ DialogService, MessageService, ConfirmationService ]
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
              private dialogSvc: DialogService,
              private messageSvc: MessageService,
              private confirmationSvc: ConfirmationService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.getAccounts();

    this.menuItems = [
      {
        label: 'Details',
        icon: 'pi pi-list',
        command: () => {
          // pass in account details for routing
          this.goToAccountPage(this.selectedAccount);
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
          // pass in account details for deleting
          this.delete(this.selectedAccount);
        }
      }
    ];
  }

  private goToAccountPage(account: Account) {
    // console.info('>>> navigating to account page:', account.accountId);
    this.router.navigate(['/user/accounts', account.accountId]);
  }

  private edit(account: Account) {
    // console.info('inside account-list edit button: ',account);

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

      if (account != null) {
        this.accountSvc.modifyAccount(account)
          .then( data => {
            console.info('>>> msg from server: ', data.message);

            // refresh account list after submitting form
            this.getAccounts();
          });
        this.messageSvc.add({ severity: 'success',
          summary: 'Success', detail: `Edited ${account.accountName}` });
      }
    });
  }

  private delete(account: Account) {
    this.confirmationSvc.confirm({
      message: 'Please confirm the deletion',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.accountSvc.deleteAccount(account.accountId)
          .then(data => {
            console.info('>>> msg from server: ', data.message);

            // refresh account list after deleting
            this.getAccounts();
          });
        this.messageSvc.add({ severity: 'success',
          summary: 'Success', detail: `Deleted ${account.accountName}` });
      }
    });
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

      if (account != null) {
        this.accountSvc.addAccount(account)
          .then( data => {
            console.info('>>> msg from server: ', data.message);

            // refresh account list after submitting form
            this.getAccounts();
          });
        this.messageSvc.add({ severity: 'success',
          summary: 'Success', detail: `Added ${account.accountName}` });
      }
    });
  }

  // get list of accounts
  private getAccounts() {
    this.accountSvc.getAccounts(this.userId)
      .then(data => {
        this.accounts = data;
        console.info('>>> accounts: ', this.accounts);
      });
  }

  ngOnDestroy():void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
