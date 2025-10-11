import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'auth-token'; // Key used to store the token

  // Save the token to sessionStorage
  SetToken(token: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.tokenKey, token);
    }
  }

  // Retrieve the token from sessionStorage
  GetToken(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem(this.tokenKey);
    }
    return null; // Return null if not in the browser
  }

  // Remove the token from sessionStorage
  RemoveToken(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.tokenKey);
    }
  }

  // Check if the code is running in the browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  GetPayload(){
    const token = this.GetToken();
    let payload;
    if (token){
      payload = token.split('.')[1];
      payload = JSON.parse(window.atob(payload));
    }

    return payload.data
  }
}