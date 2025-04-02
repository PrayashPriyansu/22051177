export interface Comment {
  id: number;
  postid: number;
  content: string;
}

export interface Post {
  id: number;
  userid: number;
  content: string;
  date: string;
  comments?: Comment[];
}

export interface User {
  id: string;
  name: string;
  posts?: Post[];
}
