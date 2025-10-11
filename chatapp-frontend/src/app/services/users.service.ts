import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient,private tokenService:TokenService) { }

  GetAllUsers(): Observable<any>{
    return this.http.get(`${BASEURL}/user/users`)
  }

  GetAllUserById(id:any): Observable<any>{
    return this.http.get(`${BASEURL}/user/users/${id}`)
  }

  GetAllUserByName(username:any): Observable<any>{
    return this.http.get(`${BASEURL}/user/username/${username}`)
  }

  GetNotfications(): Observable<any>{
    console.log('GetNotfications called')
    return this.http.get(`${BASEURL}/user/notifications`)
  }

  FollowUser(userFollowed:any): Observable<any> {
    return this.http.post(`${BASEURL}/friends/follow-user`,
     userFollowed )
  }

  UnFollowUser(userFollowed:any): Observable<any> {
    return this.http.post(`${BASEURL}/friends/unfollow-user`, userFollowed )
  }

  MarkNotification(id: any, deleteValue?: boolean): Observable<any> {
    return this.http.put(`${BASEURL}/friends/mark/${id}`, {
      id,
      deleteValue
    });
  }

  MarkAllAsRead(): Observable<any>{
    return this.http.post(`${BASEURL}/friends/mark-all`,{
      all:true
    })
  }

  AddImage(image: any): Observable<any>{
    return this.http.post(`${BASEURL}/upload-image`, image, {
      headers: { Authorization: `Bearer ${this.tokenService.GetToken()}` }
    });
  }

  ProfileNotification(userId: any): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, { userId });
  }

  ChangePassword(body:any): Observable<any>{
    return this.http.post(`${BASEURL}/user/change-password`, body);
  }
  // uploadImage(formData: FormData) {
  //   return this.http.post<any>('/api/users/upload-image', formData);
  // }


  }
