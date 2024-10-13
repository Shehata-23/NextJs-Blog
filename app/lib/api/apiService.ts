import { API_BASE_URL } from "./config";
import {
  User,
  BlogPost,
  Comment,
  createBlogData,
  GETBlogPost,
  CreateCommentPayload,
} from "./types";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making request to: ${url}`);
    console.log("Request options:", options);

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const responseData = await response.text();
    console.log("Response status:", response.status);
    console.log("Response body:", responseData);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\nResponse: ${responseData}`
      );
    }

    console.log("PARSED", JSON.parse(responseData));

    return responseData ? JSON.parse(responseData) : {};
  }

  // Auth endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    console.log("Registering user with data:", userData);
    return this.request<{ message: string }>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    return this.request<{ accessToken: string }>("/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request("/auth/logout", { method: "POST" });
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/refresh",
        {
          method: "GET",
          headers: {},
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      return { accessToken: data.accessToken };
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request(`/auth/forget-password?email=${email}`);
  }

  async resetPassword(resetData: {
    email: string;
    newPassword: string;
    confirmNewPassword: string;
    token: string
  }): Promise<{ message: string }> {
    return this.request("/auth/reset-password", {
      method: "PUT",
      body: JSON.stringify(resetData),
    });
  }

  // User endpoints (Require Token)
  async getUsers(token: string): Promise<User[]> {
    return this.request("/users", {}, token);
  }

  async getUser(
    id: string,
    token: string,
    full: boolean = false
  ): Promise<User> {
    return this.request(`/users/${id}${full ? "?full=true" : ""}`, {}, token);
  }

  async updateUser(
    id: string,
    userData: Partial<User>,
    token: string
  ): Promise<{ message: string }> {
    return this.request(
      `/users/${id}`,
      { method: "PUT", body: JSON.stringify(userData) },
      token
    );
  }

  async deleteUser(id: string, token: string): Promise<{ message: string }> {
    return this.request(`/users/${id}`, { method: "DELETE" }, token);
  }

  async followUser(id: string, token: string): Promise<{ message: string }> {
    return this.request(`/users/${id}/follow`, { method: "POST" }, token);
  }

  async changeUserRole(
    id: string,
    role: "user" | "admin",
    token: string
  ): Promise<{ message: string }> {
    return this.request(
      `/users/${id}/admin`,
      { method: "PUT", body: JSON.stringify({ role }) },
      token
    );
  }

  // Blog endpoints (Require Token)
  async getBlogs(
    token: string,
    params: { authorid?: string; tag?: string; page?: number } = {}
  ): Promise<createBlogData> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request(`/blogs?${queryParams}`, {}, token);
  }

  async createBlog(
    blogData: Partial<BlogPost>,
    token: string
  ): Promise<BlogPost> {
    return this.request(
      "/blogs",
      { method: "POST", body: JSON.stringify(blogData) },
      token
    );
  }

  async getBlog(id: string, token: string): Promise<GETBlogPost> {
    return this.request(`/blogs/${id}`, {}, token);
  }

  async updateBlog(
    id: string,
    blogData: Partial<BlogPost>,
    token: string
  ): Promise<{ message: string }> {
    console.log("******************** ID **********************");
    console.log(id);
    return this.request(
      `/blogs/${id}`,
      { method: "PUT", body: JSON.stringify(blogData) },
      token
    );
  }

  async deleteBlog(id: string, token: string): Promise<{ message: string }> {
    return this.request(`/blogs/${id}`, { method: "DELETE" }, token);
  }

  async getFollowedBlogs(
    token: string,
    page?: number
  ): Promise<createBlogData> {
    return this.request(
      `/blogs/followed-blogs${page ? `?page=${page}` : ""}`,
      {},
      token
    );
  }

  async likeBlog(id: string, token: string): Promise<{ message: string }> {
    return this.request(`/blogs/${id}/like`, { method: "POST" }, token);
  }

  // Comment endpoints (Require Token)
  async getComments(
    blogId: string,
    token: string,
    nested: boolean = false
  ): Promise<Comment[]> {
    return this.request(
      `/blogs/${blogId}/comments${nested ? "?nested=true" : ""}`,
      {},
      token
    );
  }

  async getComment(
    blogId: string,
    commentId: string,
    token: string
  ): Promise<Comment> {
    return this.request(`/blogs/${blogId}/comments/${commentId}`, {}, token);
  }

  async createComment(
    blogId: string,
    commentData: Partial<CreateCommentPayload>,
    token: string
  ): Promise<Comment> {
    return this.request(
      `/blogs/${blogId}/comments`,
      { method: "POST", body: JSON.stringify(commentData) },
      token
    );
  }

  async updateComment(
    blogId: string,
    commentId: string,
    commentData: Partial<CreateCommentPayload>,
    token: string
  ): Promise<{ message: string }> {
    return this.request(
      `/blogs/${blogId}/comments/${commentId}`,
      { method: "PUT", body: JSON.stringify(commentData) },
      token
    );
  }

  async deleteComment(
    blogId: string,
    commentId: string,
    token: string
  ): Promise<{ message: string }> {
    return this.request(
      `/blogs/${blogId}/comments/${commentId}`,
      { method: "DELETE" },
      token
    );
  }
}

export const apiService = new ApiService();
