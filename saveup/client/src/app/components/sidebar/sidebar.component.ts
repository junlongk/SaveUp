import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userFirstName!: string;

  constructor(private authSvc: AuthService,
              private router: Router) {
  }
  ngOnInit():void {
    this.userFirstName = this.authSvc.getFirstName();
  }

  logOut() {
    this.authSvc.logoutUser();
    this.router.navigate(['/login']);
  }
}
