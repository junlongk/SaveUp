import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  items!: MenuItem[];

  ngOnInit():void {
    this.items = [
      { label: 'Budgets', icon: '', routerLink: 'budgets'},
      { label: 'Transactions', icon: '', routerLink: 'transactions' },
      { label: 'Account', icon: '', routerLink: 'accounts' }
    ];
  }

}
