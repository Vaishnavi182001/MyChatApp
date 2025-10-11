import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
//import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';
  showSpinner: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router:Router,private tokenService:TokenService) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  signupUser() {
this.showSpinner = true
    this.authService.registerUser(this.signupForm.value).subscribe({
      next: data => {
        console.log(data.token);
      this.tokenService.SetToken(data.token);
        this.signupForm.reset();
       setTimeout(()=>{
      this.router.navigate(['/streams'])
       },2000)
      },
      error: err => {
        this.showSpinner = false
        console.log(err);
        if(err.error.msg)
        {
          this.errorMessage = err.error.msg[0].message
        }
        if(err.error.message)
        {
          this.errorMessage = err.error.message
        }
    }
    });
  }
}
