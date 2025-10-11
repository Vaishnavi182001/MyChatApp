
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { RouterOutlet, RouterModule } from '@angular/router';


@Component({
  selector: 'app-auth-tabs',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './auth-tabs.component.html',
  styleUrl: './auth-tabs.component.css',
  standalone: true
})
export class AuthTabsComponent {

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    import('materialize-css').then(M => {
      const tabs = document.querySelector('.tabs');
      if (tabs) {
        M.Tabs.init(tabs, {});
      }
    });
  }
}
}
