import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import io from 'socket.io-client'

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent  implements OnInit {

  socketHost: any; //tp host url for nodejs application localhost:3000
  socket:any;  //to emit the event
  postForm!: FormGroup
  constructor(private fb:FormBuilder,private postService: PostService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
  }


  init(){
    this.postForm = this.fb.group({
      post:['', Validators.required]
    })
  }

  submitPost() {
    if (this.postForm.valid) {
      this.postService.addPost(this.postForm.value).subscribe({
        next: (data) => {
          console.log('Post created successfully:', data);
          this.socket.emit('refresh', { message: 'New post added' }); // Emit the 'refresh' event
        },
        error: (err) => {
          console.error('Error creating post:', err.error.msg);
        }
      });
    }  else {
      console.error('Form is invalid');
    }

    this.postForm.reset();
  }



}
