import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Account} from "../../models/Account";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {AccountService} from "../../services/account.service";
import {AuthService} from "../../auth/auth.service";
import {DatePipe} from "@angular/common";
import {Transaction} from "../../models/Transaction";
import {Transfer} from "../../models/Transfer";

@Component({
  selector: 'app-account-transfer-form',
  templateUrl: './account-transfer-form.component.html',
  styleUrls: ['./account-transfer-form.component.css']
})
export class AccountTransferFormComponent implements OnInit{
  form!: FormGroup;
  account!: Account;
  userId!: string;
  accounts: Account[] = [];

  constructor(private fb: FormBuilder,
              public ref: DynamicDialogRef,
              private accountSvc: AccountService,
              private authSvc: AuthService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();

    // get list of accounts for drop-down population
    this.getAccounts();

    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      accountFromName: this.fb.control<string>('', [Validators.required]),
      accountFromId: this.fb.control<string>(''),
      accountToName: this.fb.control<string>('', [Validators.required]),
      accountToId: this.fb.control<string>(''),
      date: this.fb.control<Date | null>(null, [Validators.required]),
      amount: this.fb.control<number | null>(null, [Validators.required])
    });
  }

  saveTransfer() {
    const transfer = this.form.value as Transfer;

    // Get accountId from accountName field and include inside transfer
    // @ts-ignore
    transfer.accountFromId = this.getAccountIdByAccountName(transfer.accountFromName);
    // @ts-ignore
    transfer.accountToId = this.getAccountIdByAccountName(transfer.accountToName);

    // pass back account details to parent component (DynamicDialog)
    this.ref.close(transfer);
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
