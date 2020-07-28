import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PostListComponent } from "./pages/post-list/post-list.component";
import { CreatePostComponent } from "./pages/create-post/create-post.component";

const routes: Routes = [
  { path: "", redirectTo: "posts", pathMatch: "full" },
  { path: "posts", component: PostListComponent },
  { path: "create", component: CreatePostComponent },
  { path: "edit/:postId", component: CreatePostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
