import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Transaction} from "../../models/Transaction";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  form!: FormGroup;
  transaction!: Transaction;

  constructor(private fb: FormBuilder,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private datepipe: DatePipe) { }

  ngOnInit():void {
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
      const payeeCtrl = this.form.get('payee') as FormControl;
      const payeeAccountIdCtrl = this.form.get('payeeAccountId') as FormControl;
      const payeeAccountNameCtrl = this.form.get('payeeAccountName') as FormControl;
      const envelopeIdCtrl = this.form.get('envelopeId') as FormControl;
      const envelopeNameCtrl = this.form.get('envelopeName') as FormControl;
      const memoCtrl = this.form.get('memo') as FormControl;
      const outflowCtrl = this.form.get('outflow') as FormControl;
      const inflowCtrl = this.form.get('inflow') as FormControl;

      transactionIdCtrl.setValue(this.transaction.transactionId);
      accountIdCtrl.setValue(this.transaction.accountId);
      accountNameCtrl.setValue(this.transaction.accountName);
      dateCtrl.setValue(formattedDate);
      payeeCtrl.setValue(this.transaction.payee);
      payeeAccountIdCtrl.setValue(this.transaction.payeeAccountId);
      payeeAccountNameCtrl.setValue(this.transaction.payeeAccountName);
      envelopeIdCtrl.setValue(this.transaction.envelopeId);
      envelopeNameCtrl.setValue(this.transaction.envelopeName);
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
      payee: this.fb.control<string>('', [Validators.required]),
      // payee accountId & accountName not mandatory as they are for transfers only
      payeeAccountId: this.fb.control<string>(''),
      payeeAccountName: this.fb.control<string>(''),
      // envelopeId is not mandatory as it is hidden field
      // envelopeName is required for "Envelope not needed" for transfers
      envelopeId: this.fb.control<string>(''),
      envelopeName: this.fb.control<string>('', [Validators.required]),
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

    // prevent saving 'null' as form value
    if (transaction.outflow == null)
      transaction.outflow = 0;
    if (transaction.inflow == null)
      transaction.inflow = 0;

    this.ref.close(transaction);
  }
}
