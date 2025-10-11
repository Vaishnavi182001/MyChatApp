import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

//@Injectable()

// export class TokenInterceptor implements HttpInterceptor {
//     constructor(private tokenService:TokenService) {
//         console.log("TokenInterceptor");
//     }
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         console.log("TokenInterceptor intercept");
//         const clonedRequest = req.clone();
//         const headersConfig: { [key: string]: string } = {
//             'content-type': 'application/json',
//             Accept: 'application/json'
//         };

//         const token = this.tokenService.GetToken();
//         console.log("token", token);
//         if (token) {
//             headersConfig['Authorization'] = `Bearer ${token}`;
//         }

//         return next.handle(clonedRequest);
//     }

// }

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  //console.log(req.url);
  const token = inject(TokenService).GetToken();
  //console.log('authToken', token);

  const clonedRequest = req.clone();
  const headersConfig: { [key: string]: string } = {
    'content-type': 'application/json',
    Accept: 'application/json',
  };

  // const token = this.tokenService.GetToken();
  //console.log("token", token);
  if (token) {
    //console.log('token', token);
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const clone = clonedRequest.clone({ setHeaders: headersConfig });

      return next(clone);

  return next(clonedRequest);
;
}
