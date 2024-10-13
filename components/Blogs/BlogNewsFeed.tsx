"use client";

import { useState } from "react";
import BlogList from "./BlogList";
import { createBlogData } from "@/app/lib/api/types";
import { Globe, Users } from "lucide-react";

interface BlogNewsfeedProps {
  userId: string;
  token: string;
  initialBlogs: createBlogData[];
}

export default function BlogNewsfeed({
  token,
  initialBlogs,
}: BlogNewsfeedProps) {
  const [showFollowing, setShowFollowing] = useState(true);
  const blogsToShow = showFollowing ? initialBlogs[1] : initialBlogs[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-cyan-800">Blog Newsfeed</h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors duration-300 ${
              !showFollowing
                ? "bg-cyan-600 text-white shadow-lg"
                : "bg-white text-cyan-800 border border-cyan-600 hover:bg-cyan-100"
            }`}
            onClick={() => setShowFollowing(false)}
          >
            <Globe size={20} />
            <span>All Blogs</span>
          </button>
          <button
            className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors duration-300 ${
              showFollowing
                ? "bg-cyan-600 text-white shadow-lg"
                : "bg-white text-cyan-800 border border-cyan-600 hover:bg-cyan-100"
            }`}
            onClick={() => setShowFollowing(true)}
          >
            <Users size={20} />
            <span>Following</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-6">
        <BlogList
          initialBlogs={blogsToShow.data}
          token={token}
          showFollowing={showFollowing}
          totalPageCount={blogsToShow.totalPagesCount}
        />
      </div>
    </div>
  );
}
