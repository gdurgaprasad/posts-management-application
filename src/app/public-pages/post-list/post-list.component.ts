import { Component, OnInit } from "@angular/core";
import { Post } from "src/app/shared/models/post.model";
import { PostService } from "src/app/shared/services/post.service";
import { PageEvent } from "@angular/material/paginator";
import { UserService } from "src/app/shared/services/user.service";
import { map } from "rxjs/operators";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { RESPONSES, SNACKBAR_MESSAGES } from "src/app/shared/utils/constant";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  isLoading = false;

  totalPostsCount = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 1;
  currentUserId: string;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.currentUserValue
      ? this.userService.currentUserValue.userId
      : null;
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.isLoading = true;
    this.postService
      .getPosts(this.pageSize, this.currentPage)
      .pipe(
        map((postsData) => {
          return {
            posts: postsData.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            totalPostsCount: postsData.totalPostsCount,
          };
        })
      )
      .subscribe(
        (response) => {
          this.posts = response.posts;
          this.totalPostsCount = response.totalPostsCount;
          this.isLoading = false;
        },
        (error) => {
          this.snackbar.show(error, RESPONSES.FAILED);
          this.isLoading = false;
        }
      );
  }

  onPageChanged(event: PageEvent): void {
    this.isLoading = true;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.fetchPosts();
  }

  onDeletePost(postId: string): void {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(
      () => {
        this.snackbar.show(
          SNACKBAR_MESSAGES.POST_DELETE_SUCCESS,
          RESPONSES.SUCCESS
        );
        this.isLoading = false;
        this.fetchPosts();
      },
      (error) => {
        this.snackbar.show(error, RESPONSES.FAILED);
        this.isLoading = false;
      }
    );
  }
}
