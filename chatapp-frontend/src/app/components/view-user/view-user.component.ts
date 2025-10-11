import { FollowingComponent } from './../following/following.component';
import { AfterViewInit, Component ,OnInit} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { After } from 'v8';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import moment from 'moment';

@Component({
  selector: 'app-view-user',
  imports: [ToolbarComponent , CommonModule ,RouterModule],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent  implements OnInit,  AfterViewInit{

  tabElement: any;
  postsTab= false
  followingTab= false
  followersTab= false
posts: any[] = [];
 following: any[] = [];
  followers: any[] = [];
  user: any;
  name:any;

constructor(private route:ActivatedRoute,private userService:UsersService) { }
ngOnInit() {
  // const tabs = document.querySelector('.tabs');
  // if (tabs) {
  //   M.Tabs.init(tabs, {});
  // }
  this.postsTab= true;
  this.tabElement = document.querySelector('.nav-content');

  this.route.params.subscribe(params=>{
    this.name = params['name'];
    this.GetUserData(this.name);
  });

}

// ngAfterViewInit(){
//   this.tabElement.style.display = 'none'; // Hide the tab element after the view initializes

// }

async ngAfterViewInit() {
  if (typeof window !== 'undefined') {
    const M = await import('materialize-css');
    if (this.tabElement) {
      this.tabElement.style.display = 'none';
    }
    const tabs = document.querySelector('.tabs');
    if (tabs) {
      M.Tabs.init(tabs, {});
    }
  }

}

GetUserData(name:any){
   this.userService.GetAllUserByName(name).subscribe(data=>{

      this.user = data.result;
      this.posts = data.result.posts;
      this.following = data.result.following;
      this.followers = data.result.followers;

    },
    err =>console.log(err)
  );
}

ChangeTab(value:any){
  if(value === 'posts'){
    this.postsTab = true;
    this.followingTab = false;
    this.followersTab = false;
  }
      if(value === 'following'){
    this.postsTab = false;
    this.followingTab = true;
    this.followersTab = false;
  }
  if(value === 'followers'){
    this.postsTab = false;
    this.followingTab = false;
    this.followersTab = true;
  }
}

TimeFromNow(time:any){
  if (!time) return 'No date';
  return moment(time).fromNow();
}

}
