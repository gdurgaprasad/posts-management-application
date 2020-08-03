import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CreatePostComponent } from "./create-post.component";
import { CreatePostRoutingModule } from "./create-post.routing.module";
@NgModule({
  declarations: [CreatePostComponent],
  imports: [CommonModule, SharedModule, CreatePostRoutingModule],
})
export class CreatePostModule {}
