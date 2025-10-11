import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side',
  imports: [RouterModule,CommonModule],
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent implements OnInit {

  socket:any;
  user:any;
  userData:any;

  constructor(private usersService:UsersService,private tokenService:TokenService){
    this.socket = io('http://localhost:3000'); // Initialize socket connection

  }
  ngOnInit() {
    this.user = this.tokenService.GetPayload(); // Get the user from the token service
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
    this.usersService.GetAllUserById(this.user._id).subscribe(data =>{
      this.userData = data.result;
    })
  }

}
