import { AfterViewInit, Component ,OnInit, Input, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { TokenService } from '../../services/token.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import io from 'socket.io-client';
import _ from 'lodash';
import { After } from 'v8';
import {CaretEvent,EmojiEvent} from 'ng2-emoji-picker';

@Component({
  selector: 'app-message',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, AfterViewInit,OnChanges {

  @Input() users:any;
  receiver: string = '';
  user:any;
  message: string = '';
  receiverData:any;
  messagesArray:any[] = [];
  socket: any;
  typingMessage:any;
  typing=false;
  isOnline = false;


  public eventMock:any;
  public eventPosMock:any;

  public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public content = 'Type letters, enter emojis, go nuts...';

  private _lastCaretEvent!: CaretEvent;



  constructor(private tokenService:TokenService ,
    private msgService:MessageService,
    private route:ActivatedRoute,
    private usersService: UsersService
  ) {
    this.socket = io('http://localhost:3000'); // Connect to the socket server
  }

  ngOnInit() {
  this.user = this.tokenService.GetPayload();
  this.route.params.subscribe(params => {
    this.receiver = params['name'];
    this.GetUserByUserName(this.receiver);

    // Listen for the 'refreshPage' event from the server
    this.socket.on('refreshPage', () => {
      this.GetMessages(this.user._id, this.receiverData._id);
    });

    // Listen for real-time incoming messages
    this.socket.on('newMessage', (messageData: any) => {
      if (messageData.senderName !== this.user.username) {
        this.messagesArray.push(messageData);
      }
    });

    // this.usersArray = this.users;



  this.socket.on('is_typing', (data: any) => {
    if(data.sender === this.receiver){   // Check if the sender is the current receiver
      this.typing = true;
    }
  })

  this.socket.on('has_stopped_typing',(data:any) =>{
      if(data.sender === this.receiver){  // Check if the sender is the current receiver
        this.typing = false; // Stop typing indicator
      }
    })
  });
}

ngOnChanges(changes:SimpleChanges) {

  const title = document.querySelector('.nameCol');

if(changes['users'].currentValue.length>0){
    const result = _.indexOf(changes['users'].currentValue,this.receiver)
    if(result > -1){
   this.isOnline=true;
   (title as HTMLElement).style.marginTop = '10px'
    }else{
      this.isOnline = false;
        (title as HTMLElement).style.marginTop = '20px'
    }
}

}

ngAfterViewInit() {
  console.log('Room params:', this.user.username, this.receiver);
  const params = {
    room1: this.user.username,
    room2: this.receiver
  };

  this.socket.emit('joinRoom', params); // Join the room with the specified parameters

}





  GetUserByUserName(name:any){
    this.usersService.GetAllUserByName(name).subscribe(data=>{
      this.receiverData = data.result;
      this.GetMessages(this.user._id, data.result._id);

    // Join a room named after both users (sorted for consistency)
    const room = [this.user.username, this.receiverData.username].sort().join('_');
    //this.socket.emit('joinRoom', { room });
    })
  }

  Toggled(){
    this.toggled = !this.toggled;
  }


  GetMessages(senderId: any, receiverId: any) {
  this.msgService.GetAllMessages(senderId, receiverId).subscribe(data => {
    // Flatten all message arrays from all message documents
    this.messagesArray = (data.data || []).flatMap((doc: any) => doc.message || []);
    console.log('Fetched messages:', this.messagesArray); // Debugging
  });
}


  SendMessage() {
  if (this.message) {
    const newMessage = {
      body: this.message,
      senderName: this.user.username,
      receiverName: this.receiverData.username,
    };

    // Optimistically add the message to the UI
    this.messagesArray.push(newMessage);

    // Emit the sendMessage event with messageData
    this.socket.emit('sendMessage', newMessage);

    this.msgService.SendMessage(
      this.user._id,
      this.receiverData._id,
      this.receiverData.username,
      this.message
    ).subscribe(data => {
      this.message = ''; // Clear the input field after successful server operation
    });
  }
}

IsTyping(){
  this.socket.emit('start_typing',{ //start_typing name of event
   sender:this.user.username,    //sender name
  receiver:this.receiverData   //sending data to server
  });

  if(this.typingMessage) {

    clearTimeout(this.typingMessage); // Clear the previous timeout if it exists
  }
  this.typingMessage = setTimeout(() =>{
    this.socket.emit('stop_typing', {
      sender: this.user.username,
      receiver: this.receiver
    });

  },500)


}


}
