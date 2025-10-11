import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StreamsComponent } from './components/streams/streams.component';
import { AuthTabsComponent } from './components/auth-tabs/auth-tabs.component';
import { AuthGuard } from './services/auth.guard';
import { CommentsComponent } from './components/comments/comments.component';
import { PeopleComponent } from './components/people/people.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowersComponent } from './components/followers/followers.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChatComponent } from './components/chat/chat.component';
import { ImagesComponent } from './components/images/images.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Routes = [
  {
    path: '', // Default route
    component: AuthTabsComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to login
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  { path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'post/:id',
    component: CommentsComponent,
    canActivate: [AuthGuard], // Protect the comments route with AuthGuard
  },

  {
    path:'people',
    component: PeopleComponent,
    canActivate: [AuthGuard], // Protect the people route with AuthGuard
  },

  {
    path:'people/following',
    component: FollowingComponent,
    canActivate: [AuthGuard], // Protect the people route with AuthGuard
  },

  {
    path:'people/followers',
    component: FollowersComponent,
    canActivate: [AuthGuard], // Protect the people route with AuthGuard
  },

  {
    path:'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard], // Protect the people route with AuthGuard
  },

  {
    path:'chat/:name',
    component:ChatComponent,
    canActivate: [AuthGuard], // Protect the people route with AuthGuard
  },

      {
          path: 'images/:name',
          component: ImagesComponent,
          canActivate: [AuthGuard]
      },

       {
          path: ':name',
          component: ViewUserComponent,
          canActivate: [AuthGuard]
      },

      {
        path: 'user/:name/following',
        component: FollowingComponent
      },

      {
        path: 'user/:name/followers',
        component: FollowersComponent
      },

      {
        path:'account/password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard] // Protect the change password route with AuthGuard
      },

      { path: '**',
        redirectTo: ''
       } // Wildcard route redirects to default
];