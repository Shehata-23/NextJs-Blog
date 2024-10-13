"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { commentSchema, CommentType } from "@/app/zodSchemas/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { addComment, updateCommentAction } from "@/app/actions/actions";
import { CreateCommentPayload } from "@/app/lib/api/types";
import { useRouter } from "next/navigation";

export default function CommentsBar({
  userId,
  commentId,
  parentId,
  blogId,
  token,
  defaultValue,
  setUpdateForm,
}: CreateCommentPayload) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
    mode: "onBlur",
    defaultValues: { body: defaultValue || "" },
  });

  async function onSubmit(data: CommentType) {
    const formData = new FormData();
    formData.append("userId", userId);
    if (parentId) {
      formData.append("parentId", parentId);
    }

    if (defaultValue) {
      reset({ body: defaultValue });
    }

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      if (!defaultValue && !setUpdateForm) {
        await addComment(blogId, formData, token as string);
        reset();
        router.refresh();
      } else {
        await updateCommentAction(
          blogId,
          commentId as string,
          formData,
          token as string
        );
        reset();
        if (setUpdateForm) {
          setUpdateForm((prev) => !prev);
        }

        router.refresh();
      }
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 mb-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Write a comment..."
                className="w-full pr-12 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Submit</span>
          </button>
        </div>
        {errors.body && (
          <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
        )}
      </form>
    </div>
  );
}
