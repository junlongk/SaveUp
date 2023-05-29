import {Component, OnDestroy, OnInit} from '@angular/core';
import {Transaction} from "../../models/Transaction";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../auth/auth.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";
import {Transfer} from "../../models/Transfer";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/Account";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  providers: [ DialogService, MessageService, ConfirmationService ]
})
export class TransactionListComponent implements OnInit, OnDestroy {
  userId!: string;
  transactions: Transaction[] = [];
  menuItems!: MenuItem[];
  selectedTransaction!: Transaction;
  ref!: DynamicDialogRef;
  accounts: Account[] = [];

  constructor(private transactionSvc: TransactionService,
              private authSvc: AuthService,
              private dialogSvc: DialogService,
              private messageSvc: MessageService,
              private confirmationSvc: ConfirmationService,
              private accountSvc: AccountService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.getTransactions();
    this.getAccounts();

    this.menuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          // pass in transaction details for editing
          this.edit(this.selectedTransaction);
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          // pass in transaction details for deleting
          this.delete(this.selectedTransaction);
        }
      }
    ]
  }

  private edit(transaction: Transaction) {
    this.ref = this.dialogSvc.open(TransactionFormComponent, {
      data: transaction, // pass in transaction details to form component
      header: 'Edit transaction',
      width: '450px',
      height: '480px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((transaction: Transaction) => {
      console.info('subscribed transaction: ', transaction);

      if (transaction != null) {
        this.transactionSvc.modifyTransaction(transaction)
          .then(data => {
            console.info('>>> msg from server: ', data.message);

            // refresh transaction list after submitting form
            this.getTransactions();
          });

        this.messageSvc.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Edited transaction'
        });
      }
    })
  }

  private delete(transaction: Transaction) {
    this.confirmationSvc.confirm({
      message: 'Please confirm the deletion',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        // deletes 2 transactions if transfer id is found in that transaction
        // this is for data consistency
        if (transaction.transferId.length == 36) {
          this.transactionSvc.deleteTransactionByTransferId(transaction.transferId)
            .then(data => {
              console.info('>>> msg from server: ', data.message);

              // update account balance after deleting of transfer transactions
              if (transaction.outflow > 0) {
                const transfer: Transfer = {
                  accountToName: "",
                  accountToId: transaction.accountId,
                  accountFromName: "",
                  accountFromId: transaction.transferAccountId,
                  date: new Date(),
                  amount: transaction.outflow
                }
                this.accountSvc.transfer(transfer)
                  .then(data => {
                    console.info('>>> msg from server: ', data.message)
                  });
              }
              // just to reverse the above to & from
              else if (transaction.inflow > 0) {
                const transfer: Transfer = {
                  accountToName: "",
                  accountToId: transaction.transferAccountId,
                  accountFromName: "",
                  accountFromId: transaction.accountId,
                  date: new Date(),
                  amount: transaction.inflow
                }
                this.accountSvc.transfer(transfer)
                  .then(data => {
                    console.info('>>> msg from server: ', data.message)
                  });
              }

              // refresh transaction list after deleting
              this.getTransactions();
            });

          this.messageSvc.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Deleted 2 matching transaction'
          });
        }
        else {
          // normal delete operation
          this.transactionSvc.deleteTransaction(transaction.transactionId)
            .then(data => {
              console.info('>>> msg from server: ', data.message);

              // revert the account balance back to original
              if (transaction.inflow > 0) {
                const currentBalance=
                  this.getBalanceByAccountId(transaction.accountId)

                const newAccountDetails: Account = {
                  accountId: transaction.accountId,
                  accountName: transaction.accountName,
                  // @ts-ignore
                  balance: currentBalance - transaction.inflow,
                  userId: this.userId
                }

                this.accountSvc.modifyAccount(newAccountDetails)
                  .then(data => {
                    console.info('>>> msg from server: ', data.message);
                  });
              }
              // reverse
              else if (transaction.outflow > 0) {
                const currentBalance =
                  this.getBalanceByAccountId(transaction.accountId);

                const newAccountDetails: Account = {
                  accountId: transaction.accountId,
                  accountName: transaction.accountName,
                  // @ts-ignore
                  balance: currentBalance + transaction.outflow,
                  userId: this.userId
                }
                this.accountSvc.modifyAccount(newAccountDetails)
                  .then(data => {
                    console.info('>>> msg from server: ', data.message);
                  });
              }

              // refresh transaction list after deleting
              this.getTransactions();
            });

          this.messageSvc.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Deleted transaction'
          });
        }
      }
    });
  }

  create() {
    this.ref = this.dialogSvc.open(TransactionFormComponent, {
      header: 'Add new transaction',
      width: '450px',
      height: '480px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((transaction: Transaction) => {
      console.info('subscribed transaction: ', transaction);

      if (transaction != null) {
        this.transactionSvc.addTransaction(transaction)
          .then( data => {
            console.info('>>> msg from server: ', data.message);

            // refresh transaction list after submitting form
            this.getTransactions();
          });
        this.messageSvc.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Added transaction'
        });
      }
    });
  }

  private getTransactions() {
    this.transactionSvc.getTransactions(this.userId)
      .then(data => {
        this.transactions = data;
        console.info('>>> transactions', this.transactions);
      })
      .catch(error => {
          console.error(error.error.message);
        // TEMP FIX: clear transactions array after last item is deleted
          this.transactions = [];
        }
      );
  }

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

  private getBalanceByAccountId(accountId: string) {
    const account = this.accounts.find(
      acc => acc.accountId === accountId);
    return account ? account.balance : undefined;
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
