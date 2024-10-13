import React from "react";
import { getServerSession } from "next-auth/next";
import { apiService } from "@/app/lib/api/apiService";
import BlogNewsfeed from "@/components/Blogs/BlogNewsFeed";
import { authOptions } from "@/app/lib/authOptions";
import { LogIn } from "lucide-react";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyan-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center space-y-4">
          <LogIn size={48} className="text-cyan-600" />
          <p className="text-cyan-800 text-2xl font-bold">
            Please log in to view the newsfeed.
          </p>
        </div>
      </div>
    );
  }

  const allBlogs = await apiService.getBlogs(session.accessToken as string);
  const followingBlogs = await apiService.getFollowedBlogs(
    session.accessToken as string,
    1
  );

  return (
    <div className="min-h-screen bg-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <BlogNewsfeed
          initialBlogs={[allBlogs, followingBlogs]}
          userId={session.user.id as string}
          token={session.accessToken as string}
        />
      </div>
    </div>
  );
};

export default Page;
