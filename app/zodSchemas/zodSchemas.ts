import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const SigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SigninSchema = z.infer<typeof SigninSchema>;

export const BlogSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required and cannot be empty." }), 

  slug: z
    .string()
    .min(1, { message: "Slug is required and cannot be empty." }) 
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be URL-friendly, containing only lowercase letters, numbers, and hyphens.",
    }),

  body: z
    .string()
    .min(10, { message: "Body must be at least 10 characters long." }),

  coverPhoto: z
    .string()
    .url({ message: "Cover photo must be a valid URL." })
    .min(1, { message: "Cover photo URL is required and cannot be empty." }), 

  tags: z
    .array(z.string())
    .min(1, { message: "At least one tag is required." }),
});

export type BlogSchemaType = z.infer<typeof BlogSchema>;

export const commentSchema = z.object({
  body: z.string().min(1, { message: "Write a comment" }),
});

export type CommentType = z.infer<typeof commentSchema>;

export const updateUser = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must not exceed 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    coverPhoto: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type updataUserData = z.infer<typeof updateUser>;

export const requestToken = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type requestTokenType = z.infer<typeof requestToken>;

export const resetPaswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string(),
    token: z.string().min(1, "Token is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type resetPaswordType = z.infer<typeof resetPaswordSchema>;
