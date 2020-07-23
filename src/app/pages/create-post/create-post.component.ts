import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "src/app/shared/models/post.model";
import { PostService } from "src/app/shared/services/post.service";

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.component.html",
  styleUrls: ["./create-post.component.scss"],
})
export class CreatePostComponent implements OnInit {
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  onAddPost(form: NgForm) {
    // if (form.valid) {
    //   const title = form.value.title;
    //   const content = form.value.content;
    //   const post: Post = { title, content };
    //   this.postCreated.emit(post);
    //   form.reset();
    // }

    if (form.valid) {
      const title = form.value.title;
      const content = form.value.content;
      const post: Post = { title, content };
      this.postService.onPostAdded(post);
      form.reset();
    }
  }
}
