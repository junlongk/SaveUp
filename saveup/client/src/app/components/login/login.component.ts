import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserLogin} from "../../models/UserLogin";
import {AuthService} from "../../auth/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private authSvc: AuthService,
              private router: Router,
              private jwtHelperSvc: JwtHelperService) { }

  ngOnInit():void {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required])
    });
  }

  logIn() {
    const userLoginData = this.form.value as UserLogin;
    console.info('>>> user: ', userLoginData);

    this.authSvc.loginUser(userLoginData)
      .then(result => {
        const jwtToken = result.token;
        console.info('>>> jwtToken: ', jwtToken);

        // decode token
        console.info('>>> token decoded: ',
          this.jwtHelperSvc.decodeToken(jwtToken));

        if(jwtToken.length > 0) {
          localStorage.setItem('token', jwtToken);
          this.router.navigate(['/user']);
        } else {
          // TODO - need to handle 403 from server on wrong password/email
          // TODO - ask user to try again
        }
      });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
