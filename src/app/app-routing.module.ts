import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PostListComponent } from "./pages/post-list/post-list.component";
import { CreatePostComponent } from "./pages/create-post/create-post.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { LoginComponent } from "./pages/login/login.component";

const routes: Routes = [
  { path: "", redirectTo: "posts", pathMatch: "full" },
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "posts", component: PostListComponent },
  { path: "create", component: CreatePostComponent },
  { path: "edit/:postId", component: CreatePostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
