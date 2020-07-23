import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "../models/post.model";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<Post[]>();

  constructor() {}

  getUpdatedPostsSubject() {
    return this.updatedPosts.asObservable();
  }

  onPostAdded(post: Post) {
    this.posts.push(post);
    this.updatedPosts.next([...this.posts]);
  }
}
