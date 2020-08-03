import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PostService {
  constructor(private http: HttpClient) {}

  onPostAdded(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);
    return this.http.post<{ message: string; post: Post }>(
      `${environment.host}/posts`,
      postData
    );
  }

  getPosts(pageSize: number, currentPage: number) {
    return this.http.get<{
      message: string;
      posts: any;
      totalPostsCount: number;
    }>(
      `${environment.host}/posts?pageSize=${pageSize}&currentPage=${currentPage}`
    );
  }

  getPost(postId: string) {
    return this.http.get<Post>(`${environment.host}/posts/${postId}`);
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(
      `${environment.host}/posts/${postId}`
    );
  }

  updatePost(postId: string, title: string, content: string, image: any) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", postId);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image);
    } else {
      postData = { id: postId, title, content, image };
    }
    return this.http.put<{ message: string; postId: string }>(
      `${environment.host}/posts/${postId}`,
      postData
    );
  }
}
