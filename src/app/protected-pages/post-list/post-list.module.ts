import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { PostListComponent } from "./post-list.component";
import { PostListRoutingModule } from "./post-list.routing.module";
@NgModule({
  declarations: [PostListComponent],
  imports: [CommonModule, SharedModule, PostListRoutingModule],
})
export class PostListModule {}
