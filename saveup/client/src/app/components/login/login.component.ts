import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../models/User";
import {UserLogin} from "../../models/UserLogin";
import {JwtAuthService} from "../../services/jwt-auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private jwtAuthSvc: JwtAuthService,
              private router: Router) { }

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

    this.jwtAuthSvc.loginUser(userLoginData)
      .then(result => console.info('>>> jwtToken: ', result));
    this.router.navigate(['/user']);
  }
}
