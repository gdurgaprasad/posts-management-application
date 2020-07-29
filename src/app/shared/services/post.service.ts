import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post, PostResponse } from "../models/post.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<PostResponse>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    this.http
      .get<{ message: string; posts: any; totalPostsCount: number }>(
        `${environment.host}/posts?pageSize=${pageSize}&currentPage=${currentPage}`
      )
      .pipe(
        map((postsData) => {
          return {
            posts: postsData.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
              };
            }),
            totalPostsCount: postsData.totalPostsCount,
          };
        })
      )
      .subscribe((response) => {
        this.posts = response.posts;
        this.updatedPosts.next({
          posts: [...this.posts],
          totalPostsCount: response.totalPostsCount,
        });
      });
  }

  getPost(postId: string) {
    return this.http.get<Post>(`${environment.host}/posts/${postId}`);
  }

  getUpdatedPostsSubject() {
    return this.updatedPosts.asObservable();
  }

  onPostAdded(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);
    this.http
      .post<{ message: string; post: Post }>(
        `${environment.host}/posts`,
        postData
      )
      .subscribe(() => {
        this.router.navigate(["/posts"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(
      `${environment.host}/posts/${postId}`
    );
  }

  updatePost(post: Post) {
    const { image } = post;
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", post.id);
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("image", image);
    } else {
      postData = post;
    }
    return this.http.put<{ message: string; postId: string }>(
      `${environment.host}/posts/${post.id}`,
      postData
    );
  }

  getPostsFromServer() {
    return this.http.get<{ message: string; posts: Post[] }>(
      `${environment.host}/posts`
    );
  }
}
