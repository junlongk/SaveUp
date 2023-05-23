import {Component, OnDestroy, OnInit} from '@angular/core';
import {Transaction} from "../../models/Transaction";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../auth/auth.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";

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

  constructor(private transactionSvc: TransactionService,
              private authSvc: AuthService,
              private dialogSvc: DialogService,
              private messageSvc: MessageService,
              private confirmationSvc: ConfirmationService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.getTransactions();

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
        this.transactionSvc.deleteTransaction(transaction.transactionId)
          .then(data => {
            console.info('>>> msg from server: ', data.message);

            // refresh transaction list after deleting
            this.getTransactions();
          });

        this.messageSvc.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Deleted transaction'
        });
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

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
