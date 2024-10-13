import { apiService } from "@/app/lib/api/apiService";
import { authOptions } from "@/app/lib/authOptions";
import BlogForm from "@/components/Forms/BlogForm";
import HomePlate from "@/components/User/HomePlate";
import BlogList from "@/components/Blogs/BlogList";
import { getServerSession } from "next-auth";
import React from "react";
import { createBlogData } from "./../../lib/api/types";
import { LogIn } from "lucide-react";

const Home = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyan-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center space-y-4">
          <LogIn size={48} className="text-cyan-600" />
          <p className="text-cyan-800 text-2xl font-bold">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  const userData = await apiService.getUser(
    session.user.id,
    session.accessToken as string,
    true
  );

  const initialBlogsData: createBlogData = await apiService.getBlogs(
    session.accessToken as string,
    {
      authorid: session.user.id,
      page: 1,
    }
  );

  return (
    <div className="min-h-screen bg-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {userData && <HomePlate userData={userData} />}
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-cyan-800">
              Create Blog
            </h2>
            <div className="text-cyan-800">
              <BlogForm
                token={session.accessToken as string}
                id={session.user.id as string}
              />
            </div>

            {initialBlogsData && session && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6 text-cyan-800">
                  Your Blogs
                </h2>
                <div className="text-cyan-800">
                  <BlogList
                    initialBlogs={initialBlogsData.data}
                    userId={session.user.id as string}
                    token={session.accessToken as string}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
