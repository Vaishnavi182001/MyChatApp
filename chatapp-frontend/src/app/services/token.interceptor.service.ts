import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Inject, inject } from "@angular/core";
import { TokenService } from "./token.service";
// @Inject(    TokenService)
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    //console.log("authInterceptor");

    // constructor(private tokenService:TokenService) {}
    // Clone the request to add the authentication header.
    const authToken = inject(TokenService).GetToken();
    // console.log("authToken", authToken);
    // const newReq = req.clone({
    //   headers: req.headers.append('X-Authentication-Token', authToken),
    // });
    return next(req);
    // return next(newReq);
  }