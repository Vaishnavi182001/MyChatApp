import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient) { }

  SendMessage(sender_id:any,receiver_id:any,receiverName:any,message:any):Observable<any>{
    return this.http.post(`${BASEURL}/message/chat-message/${sender_id}/${receiver_id}`,{
      receiver_id,
      receiverName,
      message
    });

  }


   GetAllMessages(sender_id:any,receiver_id:any):Observable<any>{
    return this.http.get(`${BASEURL}/message/chat-message/${sender_id}/${receiver_id}`);
  }

  MarkMessages(sender:any,receiver:any):Observable<any>{
    return this.http.get(`${BASEURL}/message/receiver-messages/${sender}/${receiver}`);
  }

   MarkAllMessages():Observable<any>{
    return this.http.get(`${BASEURL}/message/mark-all-message`);
  }
}