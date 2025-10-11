import { Component,OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  posts:Array<any> = [];
  socket: any;
  user:any
  constructor(private postService: PostService, private tokenService: TokenService, private router:Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(){
    this.user = this.tokenService.GetPayload(); // Get the user from the token service
    this.AllPosts();

    this.socket.on('refreshPage', (data: any) =>{
      console.log('RefreshPage event received:', data); // Log the received event
      this.AllPosts();
    })
  }

  AllPosts(){
    this.postService.getAllPosts().subscribe(data =>{
      this.posts = data.posts;
    }, err =>{
      if(err.error.token === null){
        this.tokenService.RemoveToken(); // Delete the token if it is null or expired
        this.router.navigate(['/login']); // Navigate to the login page
      }
    })
  }

  LikePost(post:any){
    this.postService.addLike(post).subscribe(data =>{ //subscibe to read passing the post data
      console.log('Post liked successfully:', data);
      post.likesCount = data.likesCount; // Update the likes count in the UI
      this.socket.emit('refresh', { message: 'Post liked' });
    })
  }

  // Call this method after a successful post creation in your post creation component
  EmitRefreshAfterPost() {
    this.socket.emit('refresh', { message: 'New post added' });
  }

  CheckInLikesArray(arr:any,username:any){
    return _.some(arr,{username:username})
  }

  TimeFromNow(time: string): string {
    return moment(time).fromNow();
  }

  OpenCommentBox(post: any) {
    console.log('Navigating to post:', post); // Log the post object
    if (post && post._id) {
      this.router.navigate(['post', post._id]);
    } else {
      console.error('Post ID is missing or invalid');
    }
  }

}
