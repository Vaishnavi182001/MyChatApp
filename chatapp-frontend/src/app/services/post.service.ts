import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { ActivatedRoute } from '@angular/router';


const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient,private tokenService:TokenService) { }

  addPost(body: any): Observable<any>{
    const token = this.tokenService.GetToken();
    const headers = new HttpHeaders().set('Authorization', token || ''); // Add token to headers
    return this.http.post(`${BASEURL}/post/add-post`,body, {headers});
  }

  getAllPosts(): Observable<any>{
    return this.http.get(`${BASEURL}/post/posts`);
  }

  addLike(body: any): Observable<any>{
    return this.http.post(`${BASEURL}/post/add-like`,body);
  }

  addComment(body: any): Observable<any>{
    return this.http.post(`${BASEURL}/post/add-comment`,{
      postId: body.postId,
      comment: body.comment
    });
  }

  getPost(id:any):Observable<any>{
    return this.http.get(`${BASEURL}/post/posts/${id}`);
  }
}
