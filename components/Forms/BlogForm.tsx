"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ImgUploader from "@/components/Forms/ImgUploader";
import TagInput from "@/components/Blogs/TagInput";
import { createForm, EditBlog } from "@/app/actions/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogSchema } from "@/app/zodSchemas/zodSchemas";
import QuillNoSS from "react-quill";
import "react-quill/dist/quill.snow.css";
import { GETBlogPost } from "@/app/lib/api/types";

interface FormData {
  title: string;
  slug: string;
  body: string;
  tags: string[];
  coverPhoto: string;
}

interface BlogFormProps {
  token?: string;
  id?: string;
  edit?: boolean;
  editableData?: GETBlogPost;
  setIsDone?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BlogForm = ({
  token,
  id,
  edit,
  editableData,
  setIsDone,
}: BlogFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(BlogSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (edit && editableData) {
      reset({
        title: editableData.title,
        slug: editableData.slug,
        body: editableData.body,
        tags: editableData.tags,
        coverPhoto: editableData.blogCoverUrl,
      });
    }
  }, [edit, editableData, reset]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });

    if (editableData && setIsDone) {
      const editForm = await EditBlog(
        editableData._id as string,
        formData,
        token as string,
        editableData.author._id,
        `blog${editableData._id as string}`
      );
      console.log("Form updated:", editForm);
      setIsDone(true);
      edit = false;
      reset({
        title: "",
        slug: "",
        body: "",
        tags: [],
        coverPhoto: "",
      });
    } else {
      const createdForm = await createForm(
        formData,
        id as string,
        token as string
      );
      console.log("Form created:", createdForm);
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${
        editableData ? `md:w-[100%]` : " md:w-[80%]"
      } flex flex-col text-base w-[95%] shadow-xl p-9 border-t-2 border-dashed border-gray-300 gap-y-3`}
    >
      <label htmlFor="title">Blog Title</label>
      <Controller
        name="title"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <input
              {...field}
              type="text"
              placeholder="Enter your blog title"
              className={`border rounded-lg px-4 py-2 mb-1 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mb-3">
                {errors.title.message}
              </p>
            )}
          </>
        )}
      />

      <label htmlFor="slug">Slug</label>
      <Controller
        name="slug"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <input
              {...field}
              type="text"
              placeholder="Enter a unique slug"
              className={`border rounded-lg px-4 py-2 mb-1 ${
                errors.slug ? "border-red-500" : ""
              }`}
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mb-3">{errors.slug.message}</p>
            )}
          </>
        )}
      />

      <label htmlFor="body">Body</label>
      <Controller
        name="body"
        control={control}
        defaultValue=""
        rules={{
          required: "Content is required",
          validate: (value) =>
            value.trim().length > 0 || "Content cannot be empty",
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <QuillNoSS
              theme="snow"
              value={field.value}
              onChange={field.onChange}
            />
            {error && (
              <span className="text-xs text-red-500">{error.message}</span>
            )}
          </>
        )}
      />

      <label htmlFor="tags">Tags</label>
      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            <TagInput
              tags={field.value}
              setTags={(newTags: string[]) => {
                field.onChange(newTags);
                trigger("tags");
              }}
            />
            {errors.tags && (
              <p className="text-red-500 text-xs mb-3">{errors.tags.message}</p>
            )}
          </>
        )}
      />

      <Controller
        name="coverPhoto"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <ImgUploader
              formData={{ coverPhoto: field.value }}
              setFormData={(data: { coverPhoto: string }) =>
                field.onChange(data.coverPhoto)
              }
            />
            {errors.coverPhoto && (
              <p className="text-red-500 text-xs mb-3">
                {errors.coverPhoto.message}
              </p>
            )}
          </>
        )}
      />

      <button
        type="submit"
        className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-blue-600 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 w-fit"
      >
        {edit ? "Update Blog" : "Submit"}
      </button>
    </form>
  );
};

export default BlogForm;
