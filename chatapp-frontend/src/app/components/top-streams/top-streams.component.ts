import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { PostService } from '../../services/post.service';
import moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-streams',
  imports: [CommonModule],
  templateUrl: './top-streams.component.html',
  styleUrl: './top-streams.component.css'
})
export class TopStreamsComponent implements OnInit {
  topPosts:Array<any> = [];
  socket:any;
  user:any;
  constructor(private tokenService: TokenService, private router: Router, private postService: PostService) {
    this.socket = io('http://localhost:3000'); // Initialize socket connection
  }

ngOnInit() {
  this.user = this.tokenService.GetPayload(); // Get the user from the token service
  this.AllPosts();

  this.socket.on('refreshPage', (data: any) =>{
    console.log('RefreshPage event received:', data); // Log the received event
    this.AllPosts();
  })
}


  AllPosts(){
    this.postService.getAllPosts().subscribe(data =>{
      this.topPosts = data.top;
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
        this.socket.emit('refresh', { message: 'New post added' });
      })
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
