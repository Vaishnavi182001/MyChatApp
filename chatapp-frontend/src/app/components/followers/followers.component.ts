import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideComponent } from '../side/side.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { TokenService } from '../../services/token.service';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-followers',
  imports: [CommonModule,SideComponent,ToolbarComponent],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.css'
})
export class FollowersComponent implements OnInit {

  followers:any=[]
  user:any;
  socket:any;
  constructor(private tokenService:TokenService, private userService:UsersService) {
  this.socket = io('http://localhost:3000');

  }
  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.GetUser();
    this.socket.on('refreshPage',()=>{
      this.GetUser();
    });
    // Optionally join a user-specific room for notifications/messages
    if (this.user && this.user.username) {
      this.socket.emit('joinRoom', { user1: this.user.username, user2: this.user.username });
    }

  }

  GetUser(){
    this.userService.GetAllUserById(this.user._id).subscribe(
      data=>{
        this.followers = data.result.followers;
      },
      err =>console.log(err)
    )
  }

}
