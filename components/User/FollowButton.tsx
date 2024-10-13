"use client";

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { followUnfollow } from "@/app/actions/actions";
import { User } from "@/app/lib/api/types";

interface FollowButtonProps {
  userData: User;
  userId: string;
  profileId: string;
  token: string;
  path: string;
}

export default function FollowButton({
  userData,
  userId,
  profileId,
  token,
  path,
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      console.log("Worked");
      console.log(profileId);
      console.log(userData);

      const message = await followUnfollow(profileId, token, path);
      return message;
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const followersIdList = userData.followers.map((follower) => follower._id);

  const isFollowing = followersIdList.includes(userId);

  console.log(userData);

  return (
    <button
      className={`px-4 py-2 rounded-md flex items-center ${
        isFollowing
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleFollowToggle}
      disabled={isLoading}
    >
      {isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" /> Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" /> Follow
        </>
      )}
    </button>
  );
}
