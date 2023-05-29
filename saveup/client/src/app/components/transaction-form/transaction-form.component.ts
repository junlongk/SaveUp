import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Transaction} from "../../models/Transaction";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DatePipe} from "@angular/common";
import {Account} from "../../models/Account";
import {AccountService} from "../../services/account.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  form!: FormGroup;
  transaction!: Transaction;
  userId!: string;
  accounts: Account[] = [];

  constructor(private fb: FormBuilder,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private datepipe: DatePipe,
              private accountSvc: AccountService,
              private authSvc: AuthService,) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.getAccounts();

    this.form = this.createForm();

    // get transaction details when form is in editing mode
    // get data from DynamicDialogConfig as data is passed through config
    if (this.config.data != null) {
      this.transaction = this.config.data;
      console.info('>> config data: ', this.transaction);

      // convert date format to p-calendar format
      const formattedDate = this.datepipe
        .transform(this.transaction.date, 'dd-MM-yyyy');

      console.info('>>> formatted date: ', formattedDate);

      const transactionIdCtrl =  this.form.get('transactionId') as FormControl;
      const accountIdCtrl = this.form.get('accountId') as FormControl;
      const accountNameCtrl = this.form.get('accountName') as FormControl;
      const dateCtrl = this.form.get('date') as FormControl;
      const categoryCtrl = this.form.get('category') as FormControl;
      const transferAccountIdCtrl = this.form.get('transferAccountId') as FormControl;
      const transferAccountNameCtrl = this.form.get('transferAccountName') as FormControl;
      const memoCtrl = this.form.get('memo') as FormControl;
      const outflowCtrl = this.form.get('outflow') as FormControl;
      const inflowCtrl = this.form.get('inflow') as FormControl;

      transactionIdCtrl.setValue(this.transaction.transactionId);
      accountIdCtrl.setValue(this.transaction.accountId);
      accountNameCtrl.setValue(this.transaction.accountName);
      dateCtrl.setValue(formattedDate);
      categoryCtrl.setValue(this.transaction.category);
      transferAccountIdCtrl.setValue(this.transaction.transferAccountId);
      transferAccountNameCtrl.setValue(this.transaction.transferAccountName);
      memoCtrl.setValue(this.transaction.memo);
      outflowCtrl.setValue(this.transaction.outflow);
      inflowCtrl.setValue(this.transaction.inflow);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // transactionId not mandatory
      transactionId: this.fb.control<string>(''),
      // accountId not mandatory as it is hidden field
      accountId: this.fb.control<string>(''),
      accountName: this.fb.control<string>('', [Validators.required]),
      date: this.fb.control<Date | null>(null, [Validators.required]),
      category: this.fb.control<string>('', [Validators.required]),
      // transferAccountId is not mandatory as not every transaction is a transfer
      // transferAccountName is not mandatory as not every transaction is a transfer
      transferAccountId: this.fb.control<string>(''),
      transferAccountName: this.fb.control<string>(''),
      // memo is optional
      memo: this.fb.control<string>(''),
      // outflow & inflow is either-or field, hence need cross-field validation
      outflow: this.fb.control<number | null>(null),
      inflow: this.fb.control<number | null>(null)
    });
  }

  saveTransaction() {
    const transaction = this.form.value as Transaction;

    console.info('>>> saving.. ', transaction);

    // check if date is in the format of dd-MM-yyyy (invalid date for DatePipe)
    // this happens when editing form without touching date field
    // convert to ISO format
    const regex: RegExp = /(\d{2})-(\d{2})-(\d{4})/;
    if (regex.test(transaction.date.toString())) {
      transaction.date = new Date(
        transaction.date.toString()
          .replace(/(\d{2})-(\d{2})-(\d{4})/, "$2-$1-$3"));

      console.info('>>> regex-ed date: ', transaction.date);
    }

    // convert date format to just date without timezone for saving
    // as timezone(GMT +8) will cause date to fall behind by 1 day when saving
    // @ts-ignore
    transaction.date = this.datepipe
      .transform(transaction.date, 'yyyy-MM-dd');

    console.info('>>> saving new date.. ', transaction.date);

    // if both inflow and outflow has values, then find the difference
    // and set inflow/outflow accordingly
    if (transaction.outflow && transaction.inflow) {
      let difference = transaction.inflow - transaction.outflow;
      if (difference > 0) {
        transaction.inflow = difference;
        transaction.outflow = 0;
      }
      else if (difference < 0) {
        transaction.outflow = difference * -1;
        transaction.inflow = 0;
      }
    }

    // prevent saving 'null' as form value
    if (transaction.outflow == null)
      transaction.outflow = 0;
    if (transaction.inflow == null)
      transaction.inflow = 0;

    // Get accountId from accountName field and include inside transaction
    // @ts-ignore
    transaction.accountId = this.getAccountIdByAccountName(transaction.accountName);

    this.ref.close(transaction);
  }

  // get list of accounts details for form dropdown
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

  private getAccountIdByAccountName(accountName: string) {
    let account = this.accounts.find(
      account => account.accountName === accountName);
    return account ? account.accountId : null;
  }
}
