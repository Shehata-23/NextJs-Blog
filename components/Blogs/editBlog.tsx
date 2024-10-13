"use client";
import React, { useState, useEffect } from "react";
import BlogForm from "../Forms/BlogForm";
import { GETBlogPost } from "@/app/lib/api/types";
import { useRouter } from "next/navigation";

interface EditBlogProps {
  formData: GETBlogPost;
  token: string;
}

const EditBlog = ({ formData, token }: EditBlogProps) => {
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();

  function handleEdit() {
    setEdit((prevEdit) => !prevEdit);
    setEditable((prevEditable) => !prevEditable);
  }

  useEffect(() => {
    if (isDone) {
      // router.refresh();
      setIsDone((prev) => !prev);
      setEdit((prevEdit) => !prevEdit);
    }
  }, [isDone, router]);

  return (
    <div className="w-full">
      <button
        onClick={handleEdit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Edit
      </button>
      <div className={`${edit ? "visible" : "hidden"} mb-12 mt-3`}>
        <BlogForm
          edit={editable}
          editableData={formData}
          token={token}
          setIsDone={setIsDone}
        />
      </div>
    </div>
  );
};

export default EditBlog;
