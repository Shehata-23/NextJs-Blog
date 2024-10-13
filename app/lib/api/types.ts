export interface User {
  _id: string;
  id: string;
  username: string;
  followers: Array<User>;
  following: Array<User>;
  profilePicUrl: string;
  email: string;
  likes: string[];
  isAdmin: boolean;
  password?: string;
  confirmPassword?: string;
}

export interface BlogPost {
  title: string;
  author: string;
  slug: string;
  body: string;
  comments: string[];
  likedBy: string[];
  blogCoverUrl: string;
  tags: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  error?: string;
  message?: string;
}

export interface AuthorData {
  _id: string;
  username: string;
  profilePicUrl: string;
}

export interface Blog {
  _id: string;
  title: string;
  author: AuthorData;
  slug: string;
  body: string;
  commentsCount: number;
  likesCount: number;
  blogCoverUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface createBlogData {
  data: Blog[];
  page: number;
  totalBlogsCount: number;
  totalPagesCount: number;
}

export interface GETBlogPost {
  _id: string;
  title: string;
  author: {
    _id: string;
    username: string;
    profilePicUrl: string;
  };
  slug: string;
  body: string;
  comments: string[];
  likedBy: User[];
  blogCoverUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserComment {
  _id: string;
  username: string;
  profilePicUrl: string;
}

export interface ReplyType {
  _id: string;
  userId: UserComment;
  body: string;
  parentId: {
    _id: string;
    body: string;
  };
  replies: ReplyType[];
  createdAt: string;
  updatedAt: string;
}

export interface UsernestComments {
  _id: string;
  username: string;
  profilePicUrl: string;
}

export interface Comment {
  _id: string;
  body: string;
  userId: UsernestComments;
  parentId: string | null | { _id: string; body: string };
  replies: ReplyType[];
  createdAt: string;
  updatedAt: string;
}

export interface ReplyType {
  _id: string;
  body: string;
  userId: UsernestComments;
  parentId: { _id: string; body: string };
  replies: ReplyType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  parentId?: string | null; // Optional, can be null or undefined
  body?: string;
  userId: string;
  blogId: string;
  token?: string;
  defaultValue?: string;
  commentId?: string;
  setUpdateForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LikedByUser {
  _id: string;
  username: string;
  profilePicUrl: string;
}

export interface BlogContentProps {
  blogPost: GETBlogPost;
  token: string;
  authorData: User;
  sessionid: string;
  isAdmin: string;
}
export interface ToolTipProps {
  blogPost?: GETBlogPost;
  token: string;
  userData: User;
  userId: string;
  profileId: string;
  path?: string;
}
