import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';
import { AuthService } from '../services/auth.service';
import { HttpClient, provideHttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';






@NgModule({
  declarations: [AuthTabsComponent,LoginComponent,SignupComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,HttpClient
  ],
  exports: [
    AuthTabsComponent
  ],
  providers: [AuthService, provideHttpClient()]
})
export class AuthModule { }
