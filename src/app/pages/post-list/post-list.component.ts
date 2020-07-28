import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Post } from "src/app/shared/models/post.model";
import { PostService } from "src/app/shared/services/post.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];

  posts: Post[] = [];
  postsSubject: Subscription;
  isLoading = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSubject = this.postService
      .getUpdatedPostsSubject()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId);
    this.isLoading = true;
  }

  ngOnDestroy(): void {
    this.postsSubject.unsubscribe();
  }
}
