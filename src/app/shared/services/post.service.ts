import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "../models/post.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(`${environment.host}/posts`)
      .pipe(
        map((postsData) => {
          return postsData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
            };
          });
        })
      )
      .subscribe((response) => {
        this.posts = response;
        this.updatedPosts.next([...this.posts]);
      });
  }

  getPost(postId: string) {
    return this.http.get<Post>(`${environment.host}/posts/${postId}`);
  }

  getUpdatedPostsSubject() {
    return this.updatedPosts.asObservable();
  }

  onPostAdded(post: Post) {
    this.http
      .post<{ message: string; postId: string }>(
        `${environment.host}/posts`,
        post
      )
      .subscribe((postData) => {
        post.id = postData.postId;
        this.posts.push(post);
        this.updatedPosts.next([...this.posts]);
        this.router.navigate(["/posts"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete<{ message: string }>(`${environment.host}/posts/${postId}`)
      .subscribe((data) => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = [...updatedPosts];
        this.updatedPosts.next([...this.posts]);
      });
  }

  updatePost(post: Post) {
    return this.http.put<{ message: string; postId: string }>(
      `${environment.host}/posts/${post.id}`,
      post
    );
  }

  getPostsFromServer() {
    return this.http.get<{ message: string; posts: Post[] }>(
      `${environment.host}/posts`
    );
  }
}
