import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationInterceptor } from "./shared/interceptors/authentication-interceptor";
import { PublicHomeComponent } from "./public-pages/public-home.component";
import { ProtectedHomeComponent } from "./protected-pages/protected-home.component";
import { SignupComponent } from "./public-pages/signup/signup.component";
import { LoginComponent } from "./public-pages/login/login.component";
import { PostListComponent } from "./public-pages/post-list/post-list.component";
import { ErrorInterceptor } from "./shared/interceptors/error.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    PublicHomeComponent,
    SignupComponent,
    LoginComponent,
    PostListComponent,
    ProtectedHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
