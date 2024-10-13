"use client";

import React from "react";
import { likeUnlikeBLog } from "@/app/actions/actions";
import UserListDisplay from "@/components/adminDashBoard/UserListDisplay";
import { User } from "@/app/lib/api/types";
import { Session } from "next-auth";

const LikeUnlikeComp = ({
  blogId,
  token,
  likedBy,
  sessionUser,
}: {
  blogId: string;
  token: string;
  likedBy: User[];
  sessionUser: Session;
}) => {
  const handleLikeUnlike = async () => {
    await likeUnlikeBLog(blogId, token);
  };
  const isLiked = likedBy.some((user) => user._id === sessionUser.user.id);

  return (
    <>
      <div className="flex items-center  relative">
        <button
          onClick={handleLikeUnlike}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isLiked ? "red" : "none"}
            stroke={isLiked ? "red" : "currentColor"}
            className="lucide lucide-heart me-2"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        <UserListDisplay
          usersList={likedBy}
          title={"Liked by"}
          relation={"Like"}
        />
      </div>
    </>
  );
};

export default LikeUnlikeComp;
