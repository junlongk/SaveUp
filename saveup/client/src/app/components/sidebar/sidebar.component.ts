import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {StripePaymentService} from "../../services/stripe-payment.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userFirstName!: string;
  userRole!: string;

  constructor(private authSvc: AuthService,
              private router: Router,
              private stripePaymentSvc: StripePaymentService) {
  }
  ngOnInit():void {
    this.userFirstName = this.authSvc.getFirstName();
    this.userRole = this.authSvc.getRole();
  }

  logOut() {
    this.authSvc.logoutUser();
    this.router.navigate(['/login']);
  }

  pay() {
    // this.stripePaymentSvc.createPaymentIntent()
    //   .then(data =>
    // console.info(data));
    this.router.navigate(['/checkout']);
  }
}
