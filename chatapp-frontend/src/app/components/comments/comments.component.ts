import { AfterViewInit, Component,OnInit } from '@angular/core';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SideComponent } from '../side/side.component';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import moment from 'moment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [ToolbarComponent,SideComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement:any;
  commentForm!: FormGroup;
  postId:any
  commentsArray:any = [] // Array to hold comments
  socket:any
  post!: string;


  constructor(private fb:FormBuilder,private postService:PostService,private route:ActivatedRoute) {
  this.socket = io('http://localhost:3000'); // Initialize socket connection
  }

  ngOnInit(): void {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id'); // Get the post ID from the route parameters
    console.log('Post ID:', this.postId); // Log the post ID
  if (!this.postId) {
    alert('Invalid post ID. Please check the URL.');
    return;
  }
    this.init();
    this.GetPost(); // Fetch the post details when the component initializes
    this.socket.on('refreshPage',(data: any)=>{
      this.GetPost(); // Refresh the page when a refresh event is received
    });
    // Optionally join a user-specific room for notifications/messages
    // If you want to join a post-specific room, you can do:
    // this.socket.emit('joinRoom', { user1: this.postId, user2: this.postId });
  }

  ngAfterViewInit() {
   this.toolbarElement.style.display = 'none'; // Hide the toolbar after the view has been initialized
  }

  init(){
    this.commentForm = this.fb.group({
      comment: ['', Validators.required], // Initialize the comment form with a required field
    });


  }

  AddComment(){
    console.log('Comment Form Value:', this.commentForm.value.comment); // Log the comment form value
    this.postService.addComment({ postId: this.postId, comment: this.commentForm.value.comment }).subscribe(data =>{
      this.socket.emit('refresh',{}) // Emit a refresh event to the server

      this.commentForm.reset(); // Reset the form after submission
    })
  }

  GetPost() {
    console.log('Fetching post with ID:', this.postId); // Log the post ID being fetched
    this.postService.getPost(this.postId).subscribe({
      next: (data) => {
        if (data && data.post) {
          this.post = data.post.post; // Store the post data
          this.commentsArray = data.post.comments.reverse(); // Store the comments in the array
        } else {
          alert('Post not found. Please check the URL or try again later.');
        }
      },
      error: (err) => {
        console.error('Error fetching post:', err);
        if (err.status === 404) {
          alert('Post not found. Please check the URL or try again later.');
        } else {
          alert('An error occurred while fetching the post. Please try again.');
        }
      }
    });
  }

   TimeFromNow(time: string): string {
      return moment(time).fromNow();
    }

}
