import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { apiService } from "@/app/lib/api/apiService";
import BlogList from "@/components/Blogs/BlogList";
import FollowButton from "@/components/User/FollowButton";
import { createBlogData, User } from "./../../lib/api/types";
import UserListDisplay from "@/components/adminDashBoard/UserListDisplay";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import ProfilePicture from "@/components/User/ProfilePic";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center space-y-4">
          <LogIn size={48} className="text-indigo-600" />
          <p className="text-indigo-800 text-2xl font-bold">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (session.user.id === params.id) {
    redirect(`/Dashboard/Home`);
  }

  const userData = await apiService.getUser(
    params.id,
    session.accessToken as string,
    true
  );

  const initialBlogsData: createBlogData = await apiService.getBlogs(
    session.accessToken as string,
    {
      authorid: params.id,
      page: 1,
    }
  );

  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", session);

  return (
    <div className="min-h-screen bg-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <div className="flex items-center pb-4 border-b border-indigo-200">
            {session.user.name && (
              <ProfilePicture
                profilePicUrl={userData.profilePicUrl}
                username={userData.username}
                sessionUserName={session.user.name}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-indigo-800">
                {userData.username}
              </h1>
              <p className="text-sm text-indigo-600">{userData.email}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-x-4 text-indigo-700">
              <UserListDisplay
                usersList={userData.followers as User[]}
                title={"Followed by"}
                relation={"Follower"}
              />
              <UserListDisplay
                usersList={userData.following as User[]}
                title={"Following"}
                relation={"Following"}
              />
              {/* <p>
                <span className="font-bold">{initialBlogsData.totalBlogsCount}</span> Blogs
              </p> */}
            </div>
            {session.user.id !== userData._id && (
              <FollowButton
                userData={userData}
                userId={session.user.id}
                profileId={userData._id}
                token={session.accessToken as string}
                path={`user/${params.id}`}
              />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-indigo-800">Blogs</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {initialBlogsData && session && (
            <BlogList
              totalPageCount={initialBlogsData.totalPagesCount as number}
              initialBlogs={initialBlogsData.data}
              userId={params.id}
              token={session.accessToken as string}
            />
          )}
        </div>
      </div>
    </div>
  );
}
