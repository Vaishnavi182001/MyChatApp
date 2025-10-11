import { Component, OnInit } from '@angular/core';
import { SideComponent } from '../side/side.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { UsersService } from '../../services/users.service'; // Adjust the path as needed
import { CommonModule } from '@angular/common';
import _ from 'lodash'
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-people',
  imports: [SideComponent,ToolbarComponent,CommonModule,RouterModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.css'
})
export class PeopleComponent implements OnInit {
  socket: any; // Declare the socket property
  users: any[] = [];
  loggedInUser: any;
  userArr = [];
  onlineusers = [];

  constructor(private usersService: UsersService, private tokenService: TokenService, private router:Router) {
  this.socket = io('http://localhost:3000'); // Initialize socket connection
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.GetPayload(); // Get the logged-in user from the token service
    this.GetUsers(); // Fetch all users when the component initializes
    this.GetUser(); // Fetch the logged-in user details

    this.socket.on('refreshPage', () => { // Listen for the refresh event from the server
      this.GetUsers(); // Refresh the user list when the event is received
      this.GetUser(); // Refresh the logged-in user details
    });
    // Optionally join a user-specific room for notifications/messages
    if (this.loggedInUser && this.loggedInUser.username) {
      this.socket.emit('joinRoom', { user1: this.loggedInUser.username, user2: this.loggedInUser.username });
    }
  }

GetUsers() {
  this.usersService.GetAllUsers().subscribe({
    next: (data) => {
      _.remove(data.result,{username:this.loggedInUser.username}) // Remove the logged-in user from the list of users
      this.users = data.result; // Assign the received users to the component's users property
    },
    error: (err) => {
      console.error('Error fetching users:', err);
      alert('Failed to fetch users. Please try again later.');
    }
  });
}

GetUser() {
  this.usersService.GetAllUserById(this.loggedInUser._id).subscribe(data=>{
    this.userArr = data.result.following; // Assign the result to userArr property
  });
}

FollowUser(user: any) {
  const payload = { userFollowed: user._id };
  this.usersService.FollowUser(payload).subscribe({
    next: (data) => {
      console.log('User followed successfully:', data);
      this.userArr = data.following;
      this.socket.emit('refresh', {});
    },
    error: (err) => {
      console.error('Error following user:', err);
      alert('Failed to follow user. Please try again later.');
    }
  });
}

CheckInArray(arr:any,id:any){
  const result = arr.find((item:any) => item.userFollowed && item.userFollowed._id === id); // Check if the user is already in the following list
    if(result){
    return true; // User is already followed
  }else{
    return false; // User is not followed
  }
}

online(event:any){
  this.onlineusers = event
}

CheckIfOnline(name:any){
  const result = _.indexOf(this.onlineusers,name)
  if(result > -1){
    return true
  }else{
    return false
  }
}

  ViewUser(user: any) {
    this.router.navigate([user.username]);
    if (this.loggedInUser.username !== user.username) {
      this.usersService.ProfileNotification(user._id).subscribe({
        next: (data) => {
          console.log('Profile view notification sent:', data);
          this.socket.emit('refresh', {});
        },
        error: (err) => {
          console.error('Error sending profile view notification:', err);
        }
      });
    }
  }
}
