import React from "react";
import { MessageCircle, Share2 } from "lucide-react";
import { apiService } from "@/app/lib/api/apiService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import LikeUnlikeComp from "@/components/Blogs/LikeUnlikeComp";
import NestedComments from "@/components/Comments Ui/Comments";
import CommentsBar from "@/components/Forms/CommentsForm";
import BlogContent from "@/components/Blogs/BlogContent";
import { redirect } from "next/navigation";

const BlogDetailPage = async ({ params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/Login");
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <p className="text-xl font-semibold text-gray-800">
            You need to be logged in to view this page.
          </p>
        </div>
      );
    }

    const blogPost = await apiService.getBlog(
      params.id,
      session.accessToken as string
    );
    const comments = await apiService.getComments(
      params.id,
      session.accessToken as string,
      true
    );
    const authorData = await apiService.getUser(
      blogPost.author?._id,
      session.accessToken as string,
      true
    );

    const reverseComments = comments.reverse();

    return (
      <div
        className="bg-gray-50 min-h-screen py-12 relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${blogPost.blogCoverUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="flex relative flex-col justify-between items-start mb-6">
                <BlogContent
                  blogPost={blogPost}
                  token={session.accessToken as string}
                  authorData={authorData}
                  sessionid={session.user.id}
                  isAdmin={session.user.isAdmin}
                />

                <div className="flex items-center space-x-6 text-gray-500 border-t border-gray-200 pt-6">
                  <LikeUnlikeComp
                    blogId={params.id}
                    token={session.accessToken as string}
                    likedBy={blogPost.likedBy}
                    sessionUser={session}
                  />

                  <button className="flex items-center space-x-2 hover:text-blue-600 transition">
                    <MessageCircle size={24} />
                    <span className="font-medium">
                      {comments.length || 0} Comments
                    </span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-blue-600 transition">
                    <Share2 size={24} />
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </div>

              <CommentsBar
                userId={session.user.id}
                blogId={params.id}
                token={session.accessToken as string}
              />
            </div>
          </article>

          {comments.length > 0 && (
            <div className="mt-5 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Comments
                </h2>
                <div className="mt-8">
                  <NestedComments
                    comments={reverseComments}
                    userId={session.user.id}
                    blogId={params.id}
                    token={session.accessToken as string}
                    sessionId={session.user.id}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">
          Error loading blog. Please try again later.
        </p>
      </div>
    );
  }
};

export default BlogDetailPage;
