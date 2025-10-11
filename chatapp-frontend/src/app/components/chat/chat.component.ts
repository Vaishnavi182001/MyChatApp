import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import {  RouterModule } from '@angular/router';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-chat',
  imports: [ToolbarComponent,RouterModule,MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit {

  tabElement: any;
  online_users = []
  constructor(){}
  ngOnInit(){
    this.tabElement = document.querySelector('.nav-content')

  }

  ngAfterViewInit() {
    this.tabElement.style.display = 'none';

  }

  online(event:any){
    this.online_users = event;
  }

}
