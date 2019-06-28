import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor,HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getToken();

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('x_access_token', authToken?authToken:'ankit')
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}

