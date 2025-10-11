import { Component, OnInit, AfterViewInit,Output, EventEmitter } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';



@Component({
  selector: 'app-toolbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent  implements OnInit, AfterViewInit {

  @Output()
  onlineUsers = new EventEmitter();

  user:any
  notifications: Array<any> = [];
  socket:any;
  count: Array<any> = [];
  chatList: Array<any> = [];
  msgNumber = 0;
  imageId: any;
  imageVersion: any;

  constructor(private router: Router, private tokenService: TokenService,private userServices:UsersService,private msgService:MessageService) {
    this.socket=io('http://localhost:3000')
  }

// ngOnInit(){
//   this.user = this.tokenService.GetPayload();
// }

GetUser(){
  this.userServices.GetAllUserById(this.user._id).subscribe(data=>{
    this.imageId = data.result.picId;
   
    this.imageVersion = data.result.picVersion;
     console.log('data1:',this.imageId,this.imageVersion)
    this.notifications= data.result.notifications?.reverse();
    // console.log("Check",this.notifications);
    const value = _.filter(this.notifications,['read',false]);
    this.count = value;
    this.chatList = data.result.chatList;
     console.log("Chat List",this.chatList);
     //console.log(this.chatList);
     this.CheckIfread(this.chatList); // Check if the messages are read or not
  } ,err =>{
    if(err.error.token === null){
      this.tokenService.RemoveToken(); // Delete the token if it is null or expired
      this.router.navigate(['/login']); // Navigate to the login page
    }
  })
}

ngOnInit() {
  this.user = this.tokenService.GetPayload();
  this.socket.emit('online', { room: 'global', user: this.user.username });
  this.GetUser();
  this.socket.on('refreshPage', () => {
    this.GetUser();
  });
}

ngAfterViewInit() {
  // if (typeof window !== 'undefined') {
  //   import('materialize-css').then((M) => {
  //     const dropDownElements = document.querySelectorAll('.dropdown-trigger');
  //     if (dropDownElements.length > 0) {
  //       dropDownElements.forEach((dropDownElement) => {
  //         M.Dropdown.init(dropDownElement, {
  //           alignment: 'right',
  //           hover: true,
  //           coverTrigger: false,
  //         });
  //       });
  //     }
  //   }).catch((error) => {
  //     console.error('Error loading Materialize CSS:', error);
  //   });
  // }

   if (typeof window !== 'undefined') {
    import('materialize-css').then(() => {
      const dropDownElement = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(dropDownElement, {
        alignment: 'right',
        hover: true,
        coverTrigger: false
      });
      const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(dropDownElementTwo, {
        alignment: 'right',
        hover: true,
        coverTrigger: false,
      });
    });
  }


  this.socket.on('usersOnline', (data:any) =>{
    this.onlineUsers.emit(data);
  })
}

  logout(){
    this.tokenService.RemoveToken();
    this.router.navigate(['']);
  }

  GoToHome(){
    this.router.navigate(['streams'])
  }

  MarkAll(){
    this.userServices.MarkAllAsRead().subscribe(data =>{
      console.log(data);
    })
    this.socket.emit('refresh',{})
  }


  TimeFromNow(time: moment.MomentInput): string {
    return moment(time).fromNow();
  }

  MessageDate(data:any){
     return moment(data).calendar(null,{
        sameDay: 'Today',
        lastDay: 'Yesterday',
        lastWeekL:'DD/MM/YYYY',
        sameElse: 'DD/MM/YYYY'

     })
  }


  CheckIfread(arr: any[]){
    const checkArr = [];
    for(let i=0; i<arr.length; i++){
     const receiver = arr[i].msgId.message[arr[i].msgId.message.length -1];  //checking the last message in the array

    if(this.router.url !== `/chat/${receiver.senderName}`){   //if the current route is not the chat with the receiver
      if(receiver.isRead === false && receiver.receivername === this.user.username){ //if the message is not read and the receiver name is the current user
        checkArr.push(1);
        this.msgNumber = _.sum(checkArr); //summing the array to get the total number of unread messages

      }
    }
  }
}


  GoToChatPage(name:any){
    // Join the private chat room using consistent room naming
    const payload = { user1: this.user.username, user2: name };
    this.socket.emit('joinRoom', payload);
    this.router.navigate(['chat',name]);
    this.msgService.MarkMessages(this.user.username, name).subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }


  MarkAllMessages(){
    this.msgService.MarkAllMessages().subscribe(data => {
      this.socket.emit('refresh',{});
      this.msgNumber = 0;
    })
  }

  uploadImage(formData: FormData) {
    this.userServices.AddImage(formData).subscribe(
      (response: any) => {
        // Update local user fields from response
        this.user.picId = response.result.picId;
        this.user.picVersion = response.result.picVersion;
        this.imageId = response.result.picId;
        this.imageVersion = response.result.picVersion;

        // Fetch the latest user data from backend to ensure everything is up-to-date
        this.userServices.GetAllUserById(this.user._id).subscribe(data => {
          this.user = data.result; // or data.user, depending on your backend response
          this.imageId = this.user.picId;
          this.imageVersion = this.user.picVersion;
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
}

