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

  constructor(private authSvc: AuthService,
              private router: Router,
              private jwtHelperSvc: JwtHelperService) {
  }
  ngOnInit():void {
  }

  logOut() {
    this.authSvc.logoutUser();
    this.router.navigate(['/login']);
  }

  // getFirstName() {
  //   const jwtToken = localStorage.getItem('token');
  //   this.jwtHelperSvc.decodeToken(jwtToken);
  // }
}
