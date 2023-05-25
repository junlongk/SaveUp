import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {StripeService} from "../../services/stripe.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userFirstName!: string;

  constructor(private authSvc: AuthService,
              private router: Router,
              private stripeSvc: StripeService) {
  }
  ngOnInit():void {
    this.userFirstName = this.authSvc.getFirstName();
  }

  logOut() {
    this.authSvc.logoutUser();
    this.router.navigate(['/login']);
  }

  pay() {
    this.stripeSvc.getSecret()
      .then(data =>
    console.info(data));
  }
}
