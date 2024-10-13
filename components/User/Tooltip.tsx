import React from "react";
import FollowButton from "@/components/User/FollowButton";
import Image from "next/image";
import { ToolTipProps } from "@/app/lib/api/types";

const Tooltip = ({ userData, userId, profileId, token }: ToolTipProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-full w-[50px] h-[50px] overflow-hidden mr-4">
        <Image
          src={userData.profilePicUrl}
          alt={userData.username}
          width={50}
          height={50}
          className="cursor-pointer object-cover transition-transform hover:scale-110 w-full h-full"
        />
      </div>
      <p className="font-bold text-lg mb-2">{userData.username}</p>
      <div className="flex gap-6 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{userData.followers.length}</span>{" "}
          followers
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{userData.following.length}</span>{" "}
          following
        </p>
      </div>
      {userId !== profileId && (
        <FollowButton
          userData={userData}
          userId={userId}
          profileId={profileId}
          token={token}
          path={`user/${profileId}`}
        />
      )}
    </div>
  );
};

export default Tooltip;
