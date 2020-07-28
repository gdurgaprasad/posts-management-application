export interface Post {
  id?: string;
  title: string;
  content: string;
}

export interface Response {
  status: boolean;
  message: string;
  posts?: Post[];
}
