import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private tokenService: TokenService, private router: Router) { }
  title = 'chatapp';

  ngOnInit() {
    const token = this.tokenService.GetToken();
    const currentRoute = this.router.url; // Get the current route
    //console.log('currentRoute:', currentRoute);

    if (token && currentRoute) {
      // If token exists and user is on the home page, navigate to streams
      this.router.navigate([currentRoute]);
    } else if (!token && currentRoute === '/') {
      // If no token and user is on the home page, navigate to login/signup
      this.router.navigate(['/login']);
    }
  }
}