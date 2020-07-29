export interface Post {
  id?: string;
  title: string;
  content: string;
  imagePath?: string;
  image?: File;
}

export interface PostResponse {
  message?: string;
  totalPostsCount: number;
  posts: Post[];
}
