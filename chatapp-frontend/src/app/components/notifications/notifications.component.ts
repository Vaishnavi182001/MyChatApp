
import { Component, OnInit } from '@angular/core';
import { SideComponent } from '../side/side.component';
import io from 'socket.io-client';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-notifications',
  imports: [SideComponent, CommonModule, ToolbarComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  socket: any;
  notifications: Array<any> = [];
  user: any;
  flag: boolean;
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {
  this.socket = io('http://localhost:3000');
    this.notifications = [];
    this.flag = false;
  }
  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    // this.GetUser();
    this.GetNotification();
    this.socket.on('refresh page', () => {
      this.GetNotification();
    });
    // Optionally join a user-specific room for notifications/messages
    if (this.user && this.user.username) {
      this.socket.emit('joinRoom', { user1: this.user.username, user2: this.user.username });
    }
  }
  // GetUser() {
  //   this.userService.GetAllUserById(this.user._id).subscribe((data) => {
  //     console.log(data);
  //      this.notifications = data.result.notifications;
  //   });
  // }

  GetNotification() {
    this.userService.GetNotfications().subscribe((data) => {

      this.notifications = data.result.notifications || [];
      this.flag = true;
    });
  }

  TimeFromNow(time: string): string {
    return moment(time).fromNow();
  }

  MarkNotification(data: any) {
    this.userService.MarkNotification(data._id).subscribe((value) => {
       this.socket.emit('refresh', {});
      console.log(value);
    });
  }
  DeleteNotification(data: any) {
    this.userService.MarkNotification(data._id, true).subscribe((value) => {
       this.socket.emit('refresh', {});
      console.log(value);
    });
  }
}
