import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/Account";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  userId!: string;
  accounts: Account[] = [];
  cols: any[] = [
    { field: 'accountName', header: 'Name' },
    { field: 'balance', header: 'Balance' }
  ];
  overlayVisible: boolean = false;

  constructor(private accountsSvc: AccountService,
              private authSvc: AuthService) { }

  ngOnInit():void {
    this.userId = this.authSvc.getUserId();
    this.accountsSvc.getAccounts(this.userId)
      .then(data => {
        this.accounts = data;
        console.info('>>> accounts: ', this.accounts);
      });

    this.cols = [
      { field: 'accountName', header: 'Name', isNum: false},
      { field: 'balance', header: 'Balance', isNum: true},
      { field: 'accountId',}
    ];
  }

  toggle() {
    this.overlayVisible = !this.overlayVisible;
  }
}
