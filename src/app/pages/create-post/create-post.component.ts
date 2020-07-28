import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "src/app/shared/models/post.model";
import { PostService } from "src/app/shared/services/post.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.component.html",
  styleUrls: ["./create-post.component.scss"],
})
export class CreatePostComponent implements OnInit {
  post: Post;
  private mode = "create";
  private postId: string;
  isLoading = false;

  // @Output() postCreated = new EventEmitter<Post>();
  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((response) => {
          this.post = response;
          this.isLoading = false;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

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
      const post: Post = { id: this.postId || null, title, content };

      if (this.mode === "create") {
        this.isLoading = true;
        this.postService.onPostAdded(post);
      } else {
        this.isLoading = true;
        this.postService.updatePost(post).subscribe((data) => {
          this.router.navigate(["/posts"]);
        });
      }

      form.resetForm();
    }
  }
}
