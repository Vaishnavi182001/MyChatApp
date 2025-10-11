import { AuthTabsComponent } from './../components/auth-tabs/auth-tabs.component';
import { AuthRoutingModule } from '../../app/modules/auth-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../../app/modules/auth.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from '@angular/common/http'
import { StreamsModule } from '../modules/streams.module';
import { AppComponent } from '../app.component';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from '../services/token.interceptor.service';
import { CommentsComponent } from '../components/comments/comments.component';
import { PeopleComponent } from '../components/people/people.component';


@NgModule({
  declarations: [AppComponent,CommentsComponent,PeopleComponent],
  imports: [
    CommonModule,
    AuthModule,
    AuthRoutingModule,
    StreamsModule
  ],
  //providers:[provideHttpClient(withInterceptors([authInterceptor])),CookieService]
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: TokenInterceptor,
  //     multi: true

  // }]
})
export class AppModule { }
