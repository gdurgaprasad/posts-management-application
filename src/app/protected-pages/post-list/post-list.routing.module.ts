import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PostListComponent } from "./post-list.component";

const routes: Routes = [
  {
    path: "",
    component: PostListComponent,
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostListRoutingModule {}
