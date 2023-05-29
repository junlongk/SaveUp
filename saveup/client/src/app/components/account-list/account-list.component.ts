import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from "../../services/account.service";
import { Account } from "../../models/Account";
import { AuthService } from "../../auth/auth.service";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { AccountFormComponent } from "../account-form/account-form.component";
import { Transaction } from "../../models/Transaction";
import {DatePipe} from "@angular/common";
import {TransactionService} from "../../services/transaction.service";
import {AccountTransferFormComponent} from "../account-transfer-form/account-transfer-form.component";
import {Transfer} from "../../models/Transfer";

@Component({
  selector: 'app-account-list',
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
              private confirmationSvc: ConfirmationService,
              private datepipe: DatePipe,
              private transactionSvc: TransactionService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.getAccounts();

    this.menuItems = [
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

  private edit(account: Account) {
    // console.info('inside account-list edit button: ',account);

    // clone account details before editing
    const clonedAccount: Account = account;

    this.ref = this.dialogSvc.open(AccountFormComponent, {
      data: account, // pass in account details to form component
      header: 'Edit account details',
      width: '300px',
      height: '300px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((account: Account) => {
      console.info('subscribed account: ', account);

      if (account != null) {
        this.accountSvc.modifyAccount(account)
          .then( data => {
            console.info('>>> msg from server: ', data.message);

            // check if there is any difference in balance
            const difference: number = account.balance - clonedAccount.balance;

            // create a transaction for balance adjustment
            if (difference !== 0) {
              let transaction: Transaction;

              if (difference > 0) {
                transaction = {
                  accountId: account.accountId,
                  accountName: account.accountName,
                  // @ts-ignore
                  date: this.datepipe
                    .transform(new Date(), 'yyyy-MM-dd'),
                  category: "Manual Adjustment",
                  transferId: "",
                  transferAccountId: "",
                  transferAccountName: "",
                  memo: "",
                  outflow: 0,
                  inflow: difference
                }
              } else {
                transaction = {
                  accountId: account.accountId,
                  accountName: account.accountName,
                  // @ts-ignore
                  date: this.datepipe
                    .transform(new Date(), 'yyyy-MM-dd'),
                  category: "Manual Adjustment",
                  transferId: "",
                  transferAccountId: "",
                  transferAccountName: "",
                  memo: "",
                  outflow: difference * -1,
                  inflow: 0
                }
              }

              console.info('>>> editing account transaction: ', transaction);
              this.transactionSvc.addTransaction(transaction)
                .then(data => {
                  console.info('>>> msg from server: ', data.message);
                });
            }

            // update accountName of all transactions if there is changes to accountName
            if (account.accountName !== clonedAccount.accountName) {
              console.info('there is difference in name!!');
              this.transactionSvc.modifyAccountName(
                account.accountId, account.accountName)
                .then(data => {
                  console.info('>>> msg from server: ', data.message);
                });
            }

            // refresh account list after submitting form
            this.getAccounts();
          });
        this.messageSvc.add({
          severity: 'success',
          summary: 'Success',
          detail: `Edited ${account.accountName}`
        });
      }
    });
  }

  private delete(account: Account) {
    this.confirmationSvc.confirm({
      message: 'Please confirm the deletion',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.accountSvc.deleteAccount(account)
          .then(data => {
            console.info('>>> msg from server: ', data.message);

            // create a transaction for account deletion
            let transaction: Transaction;

            transaction = {
              accountId: account.accountId,
              accountName: account.accountName,
              // @ts-ignore
              date: this.datepipe
                .transform(new Date(), 'yyyy-MM-dd'),
              category: "Manual Adjustment",
              transferId: "",
              transferAccountId: "",
              transferAccountName: "",
              memo: "Account deleted",
              outflow: account.balance,
              inflow: 0
            }

            console.info('>>> closing account transaction: ', transaction);
            this.transactionSvc.addTransaction(transaction)
              .then(data => {
                console.info('>>> msg from server: ', data.message);

                // update accountName of all deleted account with '(Deleted)'
                this.transactionSvc.modifyAccountName(
                  account.accountId, `${account.accountName} (Deleted)`)
                  .then(data => {
                    console.info('>>> msg from server: ', data.message);
                  });
              });

            // refresh account list after deleting
            this.getAccounts();
          });
        this.messageSvc.add({
          severity: 'success',
          summary: 'Success',
          detail: `Deleted ${account.accountName}`
        });
      }
    });
  }

  create() {
    this.ref = this.dialogSvc.open(AccountFormComponent, {
      header: 'Add new account',
      width: '300px',
      height: '300px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((account: Account) => {
      console.info('subscribed account: ', account);

      if (account != null) {
        this.accountSvc.addAccount(account)
          .then( data => {
            console.info(data);
            console.info('>>> msg from server: ', data.message);

            // create a transaction for starting balance
            let transaction: Transaction;
            if (account.balance > 0) {
              transaction = {
                accountId: data.accountId,
                accountName: account.accountName,
                // @ts-ignore
                date: this.datepipe
                  .transform(new Date(), 'yyyy-MM-dd'),
                category: "Starting Balance",
                transferId: "",
                transferAccountId: "",
                transferAccountName: "",
                memo: "",
                outflow: 0,
                inflow: account.balance
              }
            } else {
              transaction = {
                accountId: data.accountId,
                accountName: account.accountName,
                // @ts-ignore
                date: this.datepipe
                  .transform(new Date(), 'yyyy-MM-dd'),
                category: "Starting Balance",
                transferId: "",
                transferAccountId: "",
                transferAccountName: "",
                memo: "",
                outflow: account.balance * -1,
                inflow: 0
              }
            }

            console.info('>>> opening account transaction: ', transaction);
            this.transactionSvc.addTransaction(transaction)
              .then(data => {
                console.info('>>> msg from server: ', data.message);
              });

            // refresh account list after submitting form
            this.getAccounts();
          });
        this.messageSvc.add({
          severity: 'success',
          summary: 'Success',
          detail: `Added ${account.accountName}`
        });
      }
    });
  }

  // get list of accounts
  private getAccounts() {
    this.accountSvc.getAccounts(this.userId)
      .then(data => {
        this.accounts = data;
        console.info('>>> accounts: ', this.accounts);
      })
      .catch(error => {
          console.error(error.error.message);
          // TEMP FIX: clear accounts array after last item is deleted
          this.accounts = [];
        }
      );
  }

  ngOnDestroy():void {
    if (this.ref) {
      this.ref.close();
    }
  }

  createTransfer() {
    this.ref = this.dialogSvc.open(AccountTransferFormComponent, {
      header: 'New Transfer',
      width: '300px',
      height: '500px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((transfer) => {
      console.info('subscribed: ', transfer);

      if (transfer != null) {
        this.accountSvc.transfer(transfer)
          .then( data => {
            console.info(data);
            console.info('>>> msg from server: ', data.message);

            // create two transactions for transfer
            // one for 'To' account with inflow
            // one for 'From' account with outflow

            const transactionFrom: Transaction = {
              accountId: transfer.accountFromId,
              accountName: transfer.accountFromName,
              // @ts-ignore
              date: this.datepipe
                .transform(transfer.date, 'yyyy-MM-dd'),
              category: "Transfer",
              transferId: data.transferId,
              transferAccountId: transfer.accountToId,
              transferAccountName: transfer.accountToName,
              memo: "",
              outflow: transfer.amount,
              inflow: 0
            }

            const transactionTo: Transaction = {
              accountId: transfer.accountToId,
              accountName: transfer.accountToName,
              // @ts-ignore
              date: this.datepipe
                .transform(transfer.date, 'yyyy-MM-dd'),
              category: "Transfer",
              transferId: data.transferId,
              transferAccountId: transfer.accountFromId,
              transferAccountName: transfer.accountFromName,
              memo: "",
              outflow: 0,
              inflow: transfer.amount
            }

            console.info(transactionFrom, transactionTo);

            this.transactionSvc.addTransaction(transactionTo)
              .then(data => {
                console.info('>>> msg from server: ', data.message);
              });

            this.transactionSvc.addTransaction(transactionFrom)
              .then(data => {
                console.info('>>> msg from server: ', data.message);
              })

            // refresh account list after submitting form
            this.getAccounts();
          });
        this.messageSvc.add({
          severity: 'success',
          summary: 'Success',
          detail: `Added transfer!`
        });
      }
    });
  }
}
