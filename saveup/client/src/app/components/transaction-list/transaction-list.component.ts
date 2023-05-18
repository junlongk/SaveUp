import {Component, OnInit} from '@angular/core';
import {Transaction} from "../../models/Transaction";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit{
  userId!: string;
  transactions: Transaction[] = [];

  constructor(private transactionSvc: TransactionService,
              private authSvc: AuthService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.getTransactions();
  }

  private getTransactions() {
    this.transactionSvc.getTransactions(this.userId)
      .then(data => {
        this.transactions = data;
        console.info('>>> transactions', this.transactions);
      })
  }
}
