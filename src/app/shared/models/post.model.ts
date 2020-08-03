export interface Post {
  id?: string;
  title: string;
  content: string;
  imagePath?: string;
  image?: File;
  creator?: string;
}

export interface PostResponse {
  message?: string;
  totalPostsCount: number;
  posts: Post[];
}
