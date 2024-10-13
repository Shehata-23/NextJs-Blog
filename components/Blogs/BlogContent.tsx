"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Edit2, Trash2, X } from "lucide-react";
import BlogForm from "../Forms/BlogForm";
import { deleteBlogAction } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { BlogContentProps } from "@/app/lib/api/types";
import Tooltip from "@/components/User/Tooltip";
import Link from "next/link";

const BlogContent: React.FC<BlogContentProps> = ({
  blogPost,
  token,
  authorData,
  sessionid,
  isAdmin,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();
  const toggleOptions = () => setShowOptions(!showOptions);
  const [showTooltip, setShowTooltip] = useState(false);
  console.log("Author id ", authorData._id);
  console.log("session id ", sessionid);
  const handleEdit = () => {
    setIsEditing(true);
    toggleOptions();
  };
  const iis = blogPost._id;
  console.log(iis);

  const handleCancel = () => {
    setIsEditing(false);
    setIsDone(false);
  };

  useEffect(() => {
    if (isDone) {
      setIsEditing(false);
      setIsDone(false);
    }
  }, [isDone]);

  if (isEditing) {
    return (
      <div className="relative w-full">
        <BlogForm
          token={token}
          edit={true}
          editableData={blogPost}
          setIsDone={setIsDone}
        />
        <button
          onClick={handleCancel}
          className="absolute top-0 right-0 mt-4 mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    );
  }
  return (
    <>
      <div className="absolute right-1 top-2">
        {(sessionid === authorData._id || isAdmin === "admin") && (
          <MoreVertical
            className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={toggleOptions}
          />
        )}
        {showOptions && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              {sessionid === authorData._id && (
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleEdit}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
              {(sessionid === authorData._id || isAdmin === "admin") && (
                <button
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    deleteBlogAction(blogPost._id, token);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
        {blogPost.title}
      </h1>
      <div className="flex items-center mb-8">
        <div className="rounded-full w-[50px] h-[50px] overflow-hidden mr-4">
          <Image
            src={blogPost.author.profilePicUrl}
            alt={blogPost.author.username}
            width={50}
            height={50}
            className="cursor-pointer object-cover transition-transform hover:scale-110 w-full h-full"
            onClick={() => {
              router.push(`/user/${blogPost.author._id}`);
            }}
          />
        </div>
        <div className="relative">
          <div className="cursor-pointer">
            <p
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              onMouseEnter={() => setShowTooltip((prev) => !prev)}
              onClick={() => {
                router.push(`/user/${blogPost.author._id}`);
              }}
            >
              {blogPost.author.username}
            </p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(blogPost.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          {showTooltip && (
            <div
              className="absolute left-0 mt-2 p-4 bg-white/80 shadow-lg rounded-lg border border-gray-200 z-20 min-w-[300px]"
              onMouseLeave={() => setShowTooltip((prev) => !prev)}
            >
              <Tooltip
                userData={authorData}
                userId={sessionid}
                profileId={authorData._id}
                token={token}
              />
            </div>
          )}
        </div>
      </div>

      {blogPost.blogCoverUrl && (
        <div className="mb-8 rounded-lg overflow-hidden mx-auto">
          <Image
            src={blogPost.blogCoverUrl}
            alt={blogPost.title}
            width={1200}
            height={600}
            className="rounded-lg shadow-md object-cover w-full"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none mb-8">
        <div
          dangerouslySetInnerHTML={{ __html: blogPost.body }}
          className="break-words"
        />
      </div>

      {blogPost.tags && blogPost.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {blogPost.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <span>#{tag}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default BlogContent;
