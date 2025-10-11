import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { PostComponent } from '../components/post/post.component';
import { PostService } from '../services/post.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '../components/comments/comments.component';
import { RouterModule } from '@angular/router';
import { PeopleComponent } from '../components/people/people.component';
import { UsersService } from '../services/users.service';
import { FollowingComponent } from '../components/following/following.component';
import { TopStreamsComponent } from '../components/top-streams/top-streams.component';
import { MessageService } from '../services/message.service';
// import {NgxAutoScrollModule} from 'ngx-auto-scroll';
import { ImagesComponent } from '../components/images/images.component';
import {FileUploadModule} from 'ng2-file-upload';
import { ViewUserComponent } from '../components/view-user/view-user.component';
// import { EmojiPickerModule } from 'angular2-emoji-picker';
import { EmojiPickerModule } from 'ng2-emoji-picker';


@NgModule({
  declarations: [StreamsComponent,
    ToolbarComponent,
    SideComponent,
    PostFormComponent,
    PostComponent,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    TopStreamsComponent,
    ImagesComponent,
    ViewUserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // NgxAutoScrollModule,
    FileUploadModule,
    EmojiPickerModule.forRoot()
  ],
  exports: [StreamsComponent,ToolbarComponent],
  providers: [TokenService,PostService,UsersService,MessageService]

})
export class StreamsModule { }
