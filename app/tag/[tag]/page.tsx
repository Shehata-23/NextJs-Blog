import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { apiService } from "@/app/lib/api/apiService";
import BlogList from "@/components/Blogs/BlogList";
import { createBlogData } from "../../lib/api/types";
import { Metadata } from "next";
import { Tag, Sparkles } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  return {
    title: `Blogs tagged with "${params.tag}" | Your Blog Name`,
    description: `Explore all blog posts tagged with "${params.tag}" on Your Blog Name.`,
  };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const session = await getServerSession(authOptions);

  const initialBlogsData: createBlogData = await apiService.getBlogs(
    session?.accessToken as string,
    {
      tag: params.tag,
      page: 1,
    }
  );

  const gradientColors = {
    tech: "from-blue-500 via-purple-500 to-pink-500",
    health: "from-green-400 via-emerald-500 to-teal-500",
    food: "from-yellow-400 via-orange-500 to-red-500",
    travel: "from-indigo-500 via-purple-500 to-pink-500",
    default: "from-cyan-500 via-blue-500 to-purple-500",
  };

  // Pick gradient based on tag or use default
  const tagGradient =
    gradientColors[params.tag.toLowerCase() as keyof typeof gradientColors] ||
    gradientColors.default;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${tagGradient} text-white`}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-12 w-12 text-yellow-300 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium text-white mb-6">
            <Tag className="h-4 w-4" />
            <span>Tagged Content</span>
          </div>

          <h1 className="text-4xl font-extrabold sm:text-6xl md:text-7xl mb-8">
            <span className="block mb-4">Exploring</span>
            <span className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
              #{params.tag.toUpperCase()}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed">
            Discover amazing stories, insights, and perspectives tagged with{" "}
            <span className="font-semibold">#{params.tag}</span>
          </p>
        </header>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 sm:p-8">
            {initialBlogsData && session ? (
              <BlogList
                totalPageCount={initialBlogsData.totalPagesCount as number}
                initialBlogs={initialBlogsData.data}
                userId={session.user?.id}
                token={session.accessToken as string}
                tag={params.tag}
              />
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/5 backdrop-blur-sm rounded-full p-6 w-fit mx-auto">
                  <Tag className="mx-auto h-12 w-12 text-white/70" />
                </div>
                <h3 className="mt-6 text-xl font-medium">No blogs found</h3>
                <p className="mt-3 text-white/70 max-w-md mx-auto">
                  We could not find any blogs with this tag. Try another tag or
                  check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(0,0,0,0.1),_transparent_50%)]"></div>
      </div>
    </div>
  );
}
