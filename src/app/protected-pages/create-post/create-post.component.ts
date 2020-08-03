import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Post } from "src/app/shared/models/post.model";
import { PostService } from "src/app/shared/services/post.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import {
  RESPONSES,
  SNACKBAR_MESSAGES,
  PAGES,
} from "src/app/shared/utils/constant";

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
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
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

  setForm(): void {
    this.form.setValue({
      title: this.post.title,
      content: this.post.content,
      image: this.post.imagePath,
    });
    this.selectedImage = this.post.imagePath;
  }

  onImageSelected(event: Event): void {
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

  onSavePost(): void {
    if (this.mode === "create") {
      this.createPost();
    } else {
      this.updatePost();
    }
  }

  createPost(): void {
    this.isLoading = true;
    this.postService
      .onPostAdded(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      )
      .subscribe(
        () => {
          this.snackbarService.show(
            SNACKBAR_MESSAGES.POST_CREATE_SUCCESS,
            RESPONSES.SUCCESS
          );
          this.isLoading = false;
          this.router.navigate([PAGES.POSTS]);
        },
        (error) => {
          this.snackbarService.show(error, RESPONSES.FAILED);
          this.isLoading = false;
        }
      );
  }

  updatePost(): void {
    this.isLoading = true;
    this.postService
      .updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      )
      .subscribe(
        () => {
          this.snackbarService.show(
            SNACKBAR_MESSAGES.POST_UPDATE_SUCCESS,
            RESPONSES.SUCCESS
          );
          this.isLoading = false;
          this.router.navigate([PAGES.POSTS]);
        },
        (error) => {
          this.snackbarService.show(error, RESPONSES.FAILED);
          this.isLoading = false;
        }
      );
  }
}
