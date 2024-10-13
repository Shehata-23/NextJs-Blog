"use server";
import { apiService } from "@/app/lib/api/apiService";
// import { signIn as nextAuthSignIn } from 'next-auth/react';
import { BlogPost, User } from "@/app/lib/api/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface RegisterState {
  error: string | null;
  message?: string;
}

export async function signUp(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  console.log("Form data received:", {
    username,
    email,
    password,
    confirmPassword,
  });

  if (typeof username !== "string" || username.trim() === "") {
    return { error: "Username is required" };
  }
  if (typeof email !== "string" || email.trim() === "") {
    return { error: "Email is required" };
  }
  if (typeof password !== "string" || password.trim() === "") {
    return { error: "Password is required" };
  }
  if (typeof confirmPassword !== "string" || confirmPassword.trim() === "") {
    return { error: "Confirm password is required" };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match" };
  }

  try {
    console.log("Sending registration data:", {
      username,
      email,
      password,
      confirmPassword,
    });
    const response = await apiService.register({
      username,
      email,
      password,
      confirmPassword,
    });
    console.log("API response:", response);

    return { error: null, message: "Signup successful!" };
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Signup failed. Please try again." };
  }
}

export async function createForm(
  FormData: FormData,
  author: string,
  token: string
): Promise<BlogPost | undefined> {
  // Use 'toString()' to ensure you get a string value and check for null
  const title = FormData.get("title")?.toString() || "";
  const slug = FormData.get("slug")?.toString() || "";
  const body = FormData.get("body")?.toString() || "";
  const tagsString = FormData.get("tags")?.toString();
  const tags = tagsString ? JSON.parse(tagsString) : [];
  const blogCoverUrl = FormData.get("coverPhoto")?.toString() || "";

  console.log(
    "************************************** HELLO FROM SERVER *************************************"
  );
  console.log("HELLO FROM SERVER", title, slug, body, blogCoverUrl);

  try {
    if (title && slug && body && blogCoverUrl && tags && author && token) {
      const data = await apiService.createBlog(
        { title, slug, body, blogCoverUrl, tags, author },
        token
      );
      console.log(data);
      return data as BlogPost;
    }
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return {
        error: error.message,
        message: "Error creating blog post",
      } as BlogPost;
    } else {
      return {
        error: "An unknown error occurred",
        message: "Error creating blog post",
      } as BlogPost;
    }
  } finally {
    revalidatePath("/Dashboard/Home");
  }
  return undefined;
}

export async function EditBlog(
  id: string,
  FormData: FormData,
  token: string,
  author: string,
  path: string
) {
  const title = FormData.get("title")?.toString() || "";
  const slug = FormData.get("slug")?.toString() || "";
  const body = FormData.get("body")?.toString() || "";
  const tagsString = FormData.get("tags")?.toString();
  const tags = tagsString ? JSON.parse(tagsString) : [];
  const blogCoverUrl = FormData.get("coverPhoto")?.toString() || "";

  try {
    const data = await apiService.updateBlog(
      id,
      { title, slug, body, blogCoverUrl, tags, author },
      token
    );

    console.log("update success", data);
    console.log("Updated");
    revalidatePath(path);
  } catch (error) {
    console.error("update blog failed", error);
  }
}

export async function addComment(
  blogId: string,
  formData: FormData,
  token: string
) {
  const body = formData.get("body") as string;
  const userId = formData.get("userId") as string;
  const parentId = formData.get("parentId") as string | undefined;

  console.log("**********Action blogID************************");
  console.log(blogId);
  console.log("**********Action User ID************************");
  console.log(userId);

  try {
    if (parentId) {
      const data = await apiService.createComment(
        blogId,
        {
          parentId,
          body,
          userId,
          blogId,
        },
        token
      );
      revalidatePath(`blog/${blogId}`);

      console.log("Comment success", data);
      return data;
    } else {
      console.log("********** WITHOUT PARENT ID   ***********************");

      const data = await apiService.createComment(
        blogId,
        {
          body,
          userId,
          blogId,
        },
        token
      );
      return data;
      console.log("Comment success", data);
    }
  } catch (error) {
    console.error("Comment failed", error);
  }
}

export async function updateCommentAction(
  blogId: string,
  commentId: string,
  formData: FormData,
  token: string
) {
  const body = formData.get("body") as string;
  const userId = formData.get("userId") as string;
  const parentId = formData.get("parentId") as string | undefined;

  console.log("**********Action blogID************************");
  console.log(blogId);
  console.log("**********Action User ID************************");
  console.log(userId);

  try {
    if (parentId) {
      const data = await apiService.updateComment(
        blogId,
        commentId,
        {
          parentId,
          body,
          userId,
          blogId,
          commentId,
        },
        token
      );
      console.log("Comment success", data);
      return data;
    } else {
      console.log("********** WITHOUT PARENT ID   ***********************");

      const data = await apiService.updateComment(
        blogId,
        commentId,
        {
          body,
          userId,
          blogId,
          commentId,
        },
        token
      );
      return data;
      console.log("Comment success", data);
    }
  } catch (error) {
    console.error("Comment failed", error);
  }
}

export async function deleteCommentAction(
  blogId: string,
  commentId: string,
  token: string
) {
  const res = await apiService.deleteComment(blogId, commentId, token);
  revalidatePath(`/blog/${blogId}`);

  return res;
}

export async function likeUnlikeBLog(blogId: string, token: string) {
  const message = await apiService.likeBlog(blogId, token);
  revalidatePath(`/blog/${blogId}`);

  return message;
}

export async function deleteBlogAction(blogId: string, token: string) {
  const message = await apiService.deleteBlog(blogId, token);
  redirect(`/Dashboard/Home`);

  return message;
}

export async function followUnfollow(id: string, token: string, path: string) {
  const message = await apiService.followUser(id, token);

  revalidatePath(path);

  return message;
}

export async function toggleRole(user: User, token: string, path: string) {
  const role = user.isAdmin ? "user" : "admin";
  const res = await apiService.changeUserRole(user._id, role, token);
  revalidatePath(path);
  return res;
}

export async function updateUserAction(
  id: string,
  formData: FormData,
  token: string
) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const email = formData.get("email") as string;
    const profilePicUrl = formData.get("coverPhoto") as string;

    const userData: Partial<User> = {
      username,
      password,
      confirmPassword,
      email,
    };

    if (profilePicUrl) {
      userData.profilePicUrl = profilePicUrl;
    }

    const res = await apiService.updateUser(id, userData, token);
    console.log(res);
    return redirect("/Dashboard/Home");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUserAction(
  id: string,
  token: string,
  path: string
) {
  try {
    const res = await apiService.deleteUser(id, token);
    revalidatePath(path);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function requestTokenAction(data: FormData) {
  const email = data.get("email") as string;

  try {
    const res = await apiService.forgotPassword(email);
    console.log("**************** Token ****************************");
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function resetPasswordAction(data: FormData) {
  const email = data.get("email") as string;
  const newPassword = data.get("newPassword") as string;
  const confirmNewPassword = data.get("confirmNewPassword") as string;
  const token = data.get("token") as string;

  try {
    const res = await apiService.resetPassword({
      email,
      newPassword,
      confirmNewPassword,
      token,
    });

    console.log("**************** Reset ****************************");
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
}
