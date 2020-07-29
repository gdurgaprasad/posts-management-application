import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
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
  mode = "create";
  private postId: string;
  selectedImage: string | ArrayBuffer;
  form: FormGroup;
  isLoading = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: Validators.required }),
      content: new FormControl(null, { validators: Validators.required }),
      image: new FormControl(null, { validators: Validators.required }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((response) => {
          this.post = response;
          this.setForm();
          this.isLoading = false;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  setForm() {
    this.form.setValue({
      title: this.post.title,
      content: this.post.content,
      image: this.post.imagePath,
    });
    this.selectedImage = this.post.imagePath;
  }

  onImageSelected(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image,
    });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result;
    };
    reader.readAsDataURL(image);
  }

  onSavePost() {
    const title = this.form.value.title;
    const content = this.form.value.content;
    const image = this.form.value.image;
    if (this.mode === "create") {
      this.isLoading = true;
      this.postService.onPostAdded(title, content, image);
    } else {
      this.isLoading = true;
      const post: Post = { id: this.postId, title, content, image };
      this.postService.updatePost(post).subscribe((data) => {
        this.router.navigate(["/posts"]);
      });
    }
  }
}
