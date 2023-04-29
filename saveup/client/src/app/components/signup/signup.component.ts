import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../models/User";
import {JwtAuthService} from "../../services/jwt-auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private jwtAuthSvc: JwtAuthService,
              private router: Router) { }

  ngOnInit():void {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: this.fb.control<string>('', [Validators.required]),
      lastName: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required])
    });
  }

  signUp() {
    const userData = this.form.value as User;
    console.info('>>> user: ', userData);

    this.jwtAuthSvc.signupUser(userData)
      .then(result => {
        const jwtToken = result.token;
        console.info('>>> jwtToken: ', jwtToken);

        if(jwtToken.length > 0) {
          localStorage.setItem('token', jwtToken);
          this.router.navigate(['/user']);
        } else {
          // TODO - need to handle 403 from server on wrong password/email
          // TODO - ask user to try again
        }
      });
    this.router.navigate(['/']);
  }
}
