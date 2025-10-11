import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideComponent } from '../side/side.component'; // Adjust the path as necessary
import { ToolbarComponent } from '../toolbar/toolbar.component'; // Adjust the path as necessary
import { TokenService } from '../../services/token.service';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';
import  moment from 'moment';


@Component({
  selector: 'app-following',
  imports: [CommonModule, SideComponent, ToolbarComponent],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  following: any = [];
  user:any;
 socket: any;

  constructor(private tokenService: TokenService, private usersService: UsersService){
    this.socket=io('http://localhost:3000')
  }

  ngOnInit(){
    this.user = this.tokenService.GetPayload();
    this.GetUser();
    this.socket.on('refreshPage', () => { // Listen for the refresh event from the server
      this.GetUser(); // Refresh the logged-in user details
    });
    // Optionally join a user-specific room for notifications/messages
    if (this.user && this.user.username) {
      this.socket.emit('joinRoom', { user1: this.user.username, user2: this.user.username });
    }

  }

  GetUser(){
    this.usersService.GetAllUserById(this.user._id).subscribe(data => {
    console.log(data)
      this.following = data.result.following
    //  this.socket.emit('refresh',{})
  },(err) => {
    console.log(err)
  })

}

  TimeFromNow(time: string): string {
    return moment(time).fromNow();
  }

  unFollowUser(user: any) {
    const payload = { userFollowed: user._id }; // Wrap the user ID in a JSON object
    this.usersService.UnFollowUser(payload).subscribe(
      (data) => {
        console.log(data);
        this.socket.emit('refresh', {}); // Emit a refresh event to update the UI
      },
      (err) => {
        console.error('Error unfollowing user:', err);
      }
    );
  }
}
