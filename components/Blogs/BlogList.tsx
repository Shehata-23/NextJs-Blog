"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { apiService } from "@/app/lib/api/apiService";
import { createBlogData, Blog } from "@/app/lib/api/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogList({
  initialBlogs,
  userId,
  token,
  tag = "",
  showFollowing,
  totalPageCount,
}: {
  initialBlogs: Blog[];
  userId?: string;
  token: string;
  tag?: string;
  showFollowing?: boolean;
  totalPageCount?: number;
}) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const router = useRouter();

  useEffect(() => {
    setBlogs(initialBlogs);
    setPage(2);
    setHasMore(true);
  }, [initialBlogs, showFollowing]);

  const fetchBlogs = useCallback(async () => {
    if (totalPageCount === 1) {
      setHasMore(false);
      return;
    }

    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params: { authorid?: string; page?: number; tag?: string } = {
        page,
      };
      if (userId) params.authorid = userId;
      if (tag) params.tag = tag;

      const data: createBlogData = !showFollowing
        ? await apiService.getBlogs(token, params)
        : await apiService.getFollowedBlogs(token, params.page);

      setBlogs((prevBlogs) => [...prevBlogs, ...data.data]);
      setHasMore(data.page < data.totalPagesCount);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    token,
    page,
    tag,
    loading,
    hasMore,
    showFollowing,
    totalPageCount,
  ]);

  useEffect(() => {
    if (inView) {
      fetchBlogs();
    }
  }, [inView, fetchBlogs]);

  const handleBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-12"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Blog Posts
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence>
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleBlogClick(blog._id)}
            >
              <div className="relative h-48 ">
                <Image
                  src={
                    blog.blogCoverUrl || "/placeholder.svg?height=192&width=384"
                  }
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 text-black">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.body.replace(/<[^>]*>/g, "").substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>{blog.likesCount} likes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="flex justify-center items-center mt-8"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </motion.div>
      )}
      {!hasMore && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8 "
        >
          No more posts to load.
        </motion.p>
      )}
      <div ref={ref} style={{ height: "10px" }}></div>
    </motion.div>
  );
}
