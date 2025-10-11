import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';

import { StreamsComponent } from '../components/streams/streams.component';
const routes: Routes=[
  {
    path: '',
    component: AuthTabsComponent,
  }
]
@NgModule({
  declarations: [StreamsComponent],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
