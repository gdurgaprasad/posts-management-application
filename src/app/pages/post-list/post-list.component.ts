import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Post, PostResponse } from "src/app/shared/models/post.model";
import { PostService } from "src/app/shared/services/post.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSubject: Subscription;
  isLoading = false;

  totalPostsCount = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 1;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.currentPage);
    this.postsSubject = this.postService
      .getUpdatedPostsSubject()
      .subscribe(
        (postsResponseData: { posts: Post[]; totalPostsCount: number }) => {
          this.posts = postsResponseData.posts;
          this.totalPostsCount = postsResponseData.totalPostsCount;
          this.isLoading = false;
        }
      );
  }

  onPageChanged(event: PageEvent) {
    this.isLoading = true;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postsSubject.unsubscribe();
  }
}
