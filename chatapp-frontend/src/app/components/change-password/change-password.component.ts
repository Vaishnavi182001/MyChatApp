import { Component, OnInit } from '@angular/core';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SideComponent } from '../side/side.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { doesNotMatch } from 'assert';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-change-password',
  imports: [ToolbarComponent,SideComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder,private userServices: UsersService) { }

  ngOnInit(){
    this.Init();
  }

  Init(){
    this.passwordForm = this.fb.group({
      cpassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },{
      validator: this.Validate.bind(this)
    });
  }

  ChangePassword(){
    this.userServices.ChangePassword(this.passwordForm.value).subscribe(
      data => {
        this.passwordForm.reset();
        alert('Password Changed Successfully');
      },
      err =>console.log(err)
    )
  }

  Validate(passwordFormGroup: FormGroup){
    const new_password = passwordFormGroup.controls['newPassword'].value;
    const confirm_password = passwordFormGroup.controls['confirmPassword'].value;
    if(confirm_password.length <= 0){
      return null;
    }

    if(confirm_password !== new_password){
     return {
      doesNotMatch:true
     };
    }
    return true;
}

}
