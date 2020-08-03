import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { UserService } from "../services/user.service";
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { PAGES, MESSAGES } from "../utils/constant";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.userService.logout();
          // Redirect to login page
          this.router.navigate([PAGES.PUBLIC], {
            queryParams: { returnUrl: this.router.url },
          });
        }
        const isOnline = window.navigator.onLine;
        console.log(err);
        const error = !isOnline
          ? MESSAGES.NETWORK_NOT_AVAILABLE
          : err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
