import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Transaction} from "../../models/Transaction";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

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
              public config: DynamicDialogConfig) { }

  ngOnInit():void {
    this.form = this.createForm();

    // get transaction details when form is in editing mode
    // get data from DynamicDialogConfig as data is passed through config
    if (this.config.data != null) {
      this.transaction = this.config.data;


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
    this.ref.close(transaction);
  }
}
