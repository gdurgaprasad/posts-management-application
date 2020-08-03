import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationGuard } from "./shared/guards/authentication.guard";
import { PublicHomeComponent } from "./public-pages/public-home.component";
import { LoginComponent } from "./public-pages/login/login.component";
import { PostListComponent } from "./public-pages/post-list/post-list.component";
import { ProtectedHomeComponent } from "./protected-pages/protected-home.component";
import { SignupComponent } from "./public-pages/signup/signup.component";

const routes: Routes = [
  {
    path: "",
    component: ProtectedHomeComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: "posts",
        loadChildren: () =>
          import("./protected-pages/post-list/post-list.module").then(
            (m) => m.PostListModule
          ),
      },
      {
        path: "create",
        loadChildren: () =>
          import("./protected-pages/create-post/create-post.module").then(
            (m) => m.CreatePostModule
          ),
      },
    ],
  },
  {
    path: "public",
    component: PublicHomeComponent,
    children: [
      { path: "", component: LoginComponent },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent },
      { path: "public-posts", component: PostListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
