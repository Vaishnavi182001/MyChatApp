import { Component, OnInit, PLATFORM_ID,Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SideComponent } from '../side/side.component';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostComponent } from '../post/post.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject as AngularInject } from '@angular/core';
import { TopStreamsComponent } from '../top-streams/top-streams.component';

@Component({
  selector: 'app-streams',
  imports: [ToolbarComponent,SideComponent,PostFormComponent,PostComponent,TopStreamsComponent,CommonModule],
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.css'
})
export class StreamsComponent implements OnInit {

  token: any;
  streamsTab = true;
  topStreamsTab=false;

  constructor(private tokenService: TokenService , private router:Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {

    this.token = this.tokenService.GetPayload();

       import('materialize-css').then(M => {
         const tabs = document.querySelector('.tabs');
         if (tabs) {
           M.Tabs.init(tabs, {});
         }
       });

  }


  ChangeTabs(value:any){
    if(value === 'streams'){
      this.streamsTab = true;
      this.topStreamsTab = false;
  }
     if(value === 'topStreams'){
      this.streamsTab = false;
      this.topStreamsTab = true;
    }
  }
}
