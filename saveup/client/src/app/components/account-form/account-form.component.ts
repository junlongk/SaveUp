import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Account} from "../../models/Account";

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  form!: FormGroup;
  account!: Account;

  constructor(private fb: FormBuilder,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) { }

  ngOnInit():void {
    this.form = this.createForm();

    // get account details when form is in editing mode
    // get data from DynamicDialogConfig as data is passed through config
    if (this.config.data != null) {
      // console.info('inside account-form component: ', this.config.data);
      this.account = this.config.data;

      const accountNameCtrl = this.form.get('accountName') as FormControl;
      const balanceCtrl = this.form.get('balance') as FormControl;
      const accountIdCtrl = this.form.get('accountId') as FormControl;

      accountNameCtrl.setValue(this.account.accountName);
      balanceCtrl.setValue(this.account.balance);
      accountIdCtrl.setValue(this.account.accountId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      accountName: this.fb.control<string>('', [Validators.required]),
      balance: this.fb.control<number | null>(null, [Validators.required]),
      accountId: this.fb.control<string>('')
    });
  }

  saveAccount() {
    const account = this.form.value as Account;
    // console.info('saving form..: ', account);

    // pass back account details to parent component (DynamicDialog)
    this.ref.close(account);
  }
}
